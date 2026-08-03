import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { dbPlugin } from "../plugins/db.ts";
import { sessionAuth } from "../auth/middleware.ts";
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

const preferencesResponse = t.Object({
  id: t.Integer(),
  userId: t.Integer(),
  accommodations: t.Nullable(t.Array(t.String())),
  cookingFrequency: t.Nullable(t.Integer()),
  goals: t.Nullable(t.Array(t.String())),
  gymFrequency: t.Nullable(t.Integer()),
  major: t.Nullable(t.String()),
  needsAloneTime: t.Nullable(t.Integer()),
  preferredAmenities: t.Nullable(t.Array(t.String())),
  preferredGenderHousing: t.Nullable(t.String()),
  productiveAroundOthers: t.Nullable(t.Integer()),
  socialFrequency: t.Nullable(t.Integer()),
  updatedAt: t.Nullable(t.Date()),
  year: t.Nullable(t.String()),
});

const unauthorizedResponse = t.Object({ error: t.String() });

export const preferencesRoute = new Elysia({ prefix: "/me" })
  .use(dbPlugin)
  .use(sessionAuth)

  .get(
    "/preferences",
    async ({ db, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const rows = await db
        .select()
        .from(userPreferencesTable)
        .where(eq(userPreferencesTable.userId, user.id));

      return rows[0] ?? null;
    },
    {
      response: {
        200: t.Union([preferencesResponse, t.Null()]),
        401: unauthorizedResponse,
      },
    },
  )

  .put(
    "/preferences",
    async ({ db, body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const [saved] = await db
        .insert(userPreferencesTable)
        .values({
          userId: user.id,
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
      response: {
        200: preferencesResponse,
        401: unauthorizedResponse,
      },
    },
  );
