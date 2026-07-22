import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { dbPlugin } from "../plugins/db.ts";
import { userPreferencesTable } from "../db/schema.ts";

/**
 * Body schema for PUT /preferences.
 */
const preferencesBody = t.Object({
  accommodations: t.Optional(t.Nullable(t.Array(t.String()))),
  cookingFrequency: t.Optional(t.Nullable(t.Integer({ minimum: 1, maximum: 5 }))),
  goals: t.Optional(t.Nullable(t.Array(t.String()))),
  gymFrequency: t.Optional(t.Nullable(t.Integer({ minimum: 1, maximum: 5 }))),
  major: t.Optional(t.Nullable(t.String())),
  needsAloneTime: t.Optional(t.Nullable(t.Integer({ minimum: 1, maximum: 5 }))),
  preferredAmenities: t.Optional(t.Nullable(t.Array(t.String()))),
  preferredGenderHousing: t.Optional(t.Nullable(t.String())),
  productiveAroundOthers: t.Optional(t.Nullable(t.Integer({ minimum: 1, maximum: 5 }))),
  socialFrequency: t.Optional(t.Nullable(t.Integer({ minimum: 1, maximum: 5 }))),
  year: t.Optional(t.Nullable(t.String())),
});

export const preferencesRoute = new Elysia({ prefix: "/me" })
  .use(dbPlugin)

  // TODO: add .use(requireAuth) when auth is done

  .get("/preferences", async ({ db }) => {
    // TODO: get userId from auth instead of hardcoded value
    const userId = 1;

    const rows = await db
      .select()
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.userId, userId));

    return rows[0] ?? null;
  })

  .put(
    "/preferences",
    async ({ db, body }) => {
      // TODO: get userId from auth instead of hardcoded value
      const userId = 1;

      const [saved] = await db
        .insert(userPreferencesTable)
        .values({
          userId,
          ...body,
        })
        .onConflictDoUpdate({
          target: userPreferencesTable.userId,
          set: {
            ...body,
            updatedAt: new Date(),
          },
        })
        .returning();

      return saved;
    },
    {
      body: preferencesBody,
    },
  );
