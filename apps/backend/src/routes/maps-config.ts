import { Elysia, t } from "elysia";

const mapId = "92812f53e3c1d4d7d611c6b9";

const mapsConfigResponse = t.Union([
  t.Object({
    enabled: t.Literal(true),
    apiKey: t.String(),
    mapId: t.String(),
  }),
  t.Object({
    enabled: t.Literal(false),
  }),
]);

export const mapsRoute = new Elysia({ prefix: "/config/maps" }).get(
  "/",
  () => {
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!apiKey || !mapId) {
      return { enabled: false as const };
    }

    return { enabled: true as const, apiKey, mapId };
  },
  {
    response: mapsConfigResponse,
  },
);
