import { configureLogger, logger } from "./utils/log.ts";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { elysiaLogger } from "@logtape/elysia";
import { getOrCreateUser } from "./auth/user.ts";
import { jwtAuth } from "./auth/middleware.ts";
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

const api = new Elysia({ prefix: "/api" })
  .use(elysiaLogger({ category: "housing-backend" }))
  .use(openapi({ path: "/docs", references: fromTypes() }))
  .use(healthRoute)
  .use(jwtAuth)
  .get("/me", async ({ auth }) => await getOrCreateUser(auth));

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
