import { Elysia } from "elysia";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { staticPlugin } from "@elysia/static";
import { elysiaLogger } from "@logtape/elysia";

import { configureLogger, logger } from "./utils/log.ts";
import { runMigrations } from "./db/migrations.ts";
import { healthRoute } from "./routes/health.ts";
import { placeholderRoutes } from "./routes/placeholder.ts";

const port = Deno.env.get("PORT") ? parseInt(Deno.env.get("PORT")!) : undefined;
const staticDir = Deno.env.get("STATIC_DIR");
const appUrl = Deno.env.get("APP_URL");

await configureLogger();

if (!port) {
  logger.error("PORT environment variable is not set. Exiting.");
  Deno.exit(1);
}

await runMigrations();

const api = new Elysia({ prefix: "/api" })
  .use(elysiaLogger({ category: "housing-backend" }))
  .use(openapi({ references: fromTypes() }))
  .use(healthRoute)
  .use(placeholderRoutes);

const app = new Elysia().use(api);

if (staticDir) {
  app.use(staticPlugin({ assets: staticDir, prefix: "/" }));
} else {
  logger.warn("STATIC_DIR environment variable is not set. Frontend will not be served.");
  logger.warn(
    "If you are in a development environment, access this API via the Vite dev server (http://localhost:3000).",
  );
}

Deno.serve(
  {
    port,
    onListen: ({ hostname }) => {
      logger.info(`Server listening on ${appUrl || `http://${hostname}:${port}`}`);
    },
  },
  app.handle,
);
