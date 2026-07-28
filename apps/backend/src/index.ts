import { configureLogger, logger, nodeError } from "./utils/log.ts";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { elysiaLogger } from "@logtape/elysia";
import {
  buildLoginUrl,
  buildOidcConfig,
  createRelayState,
  exchangeCodeForClaims,
  loadOidcSettings,
} from "./auth/oidc.ts";
import { sessionAuth } from "./auth/middleware.ts";
import {
  createSession,
  deleteSession,
  OAUTH_STATE_COOKIE_NAME,
  oauthStateCookieOptions,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "./auth/session.ts";
import { getOrCreateUser } from "./auth/user.ts";
import { healthRoute } from "./routes/health.ts";
import { runMigrations } from "./db/migrations.ts";
import { staticPlugin } from "@elysia/static";

const portStr = Deno.env.get("PORT");
let port = 0;
if (portStr) {
  port = Number.parseInt(portStr, 10);
}
const staticDir = Deno.env.get("STATIC_DIR");
const appUrl = Deno.env.get("APP_URL");

await configureLogger();

if (!port) {
  logger.error("PORT environment variable is not set. Exiting.");
  const EXIT_FAILURE = 1;
  Deno.exit(EXIT_FAILURE);
}

await runMigrations();

const oidcSettings = appUrl ? loadOidcSettings() : undefined;
const oidcConfig = oidcSettings ? await buildOidcConfig(oidcSettings) : undefined;
if (oidcConfig) {
  logger.info("OIDC discovery completed");
} else {
  logger.warn(
    "OIDC is not configured (missing OIDC_CLIENT_ID/APP_URL/etc.); /api/auth/login will not work.",
  );
}

function toPath(redirect: (url: string) => Response, path: string): Response {
  const target = appUrl ? new URL(path, appUrl).href : undefined;
  return target
    ? redirect(target)
    : new Response(null, { headers: { Location: path }, status: 302 });
}
function toHome(redirect: (url: string) => Response): Response {
  return toPath(redirect, "/");
}

const api = new Elysia({ prefix: "/api" })
  .use(elysiaLogger({ category: "housing-backend" }))
  .use(openapi({ path: "/docs", references: fromTypes() }))
  .use(healthRoute)
  .use(sessionAuth)
  .get("/auth/login", ({ cookie, redirect }) => {
    if (!oidcConfig || !oidcSettings || !appUrl) return toHome(redirect);

    const callbackUrl = `${appUrl}/api/auth/callback`;
    const state = createRelayState(callbackUrl);
    cookie[OAUTH_STATE_COOKIE_NAME].set({ value: state, ...oauthStateCookieOptions });

    return redirect(buildLoginUrl(oidcConfig, oidcSettings, state).href);
  })
  .get("/auth/callback", async ({ cookie, redirect, request }) => {
    if (!oidcConfig) return toHome(redirect);

    const expectedState = cookie[OAUTH_STATE_COOKIE_NAME].value;
    cookie[OAUTH_STATE_COOKIE_NAME].remove();
    if (typeof expectedState !== "string" || expectedState === "") {
      logger.warn("OIDC callback hit without a matching oauth_state cookie (expired or CSRF)");
      return toHome(redirect);
    }

    try {
      const claims = await exchangeCodeForClaims(oidcConfig, request, expectedState);
      if (!claims) {
        logger.error("OIDC callback: no ID token claims in the token response");
        return toHome(redirect);
      }

      const user = await getOrCreateUser(claims);
      const sessionId = await createSession(user.id);
      cookie[SESSION_COOKIE_NAME].set({ value: sessionId, ...sessionCookieOptions });
    } catch (error) {
      logger.error("OIDC callback failed:", nodeError(error));
      return toHome(redirect);
    }

    return toPath(redirect, "/home");
  })
  .get("/auth/logout", async ({ cookie, redirect }) => {
    const sessionId = cookie[SESSION_COOKIE_NAME].value;
    if (typeof sessionId === "string" && sessionId !== "") {
      await deleteSession(sessionId);
    }
    cookie[SESSION_COOKIE_NAME].remove();
    return toHome(redirect);
  })
  .get("/me", ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    return user;
  });

const app = new Elysia().use(api);

if (staticDir) {
  app.use(staticPlugin({ assets: staticDir, prefix: "/" }));

  const indexHtml = await Deno.readTextFile(`${staticDir}/index.html`);
  app.onError(({ code, path }) => {
    if (code === "NOT_FOUND" && !path.startsWith("/api")) {
      return new Response(indexHtml, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  });
} else {
  logger.warn("STATIC_DIR environment variable is not set. Frontend will not be served.");
  logger.warn(
    "If you are in a development environment, access this API via the Vite dev server (http://localhost:3000).",
  );
}

Deno.serve(
  {
    onListen: ({ hostname }) => {
      logger.info(`Server listening on ${appUrl || `http://${hostname}:${port}`}`);
    },
    port,
  },
  app.handle,
);
