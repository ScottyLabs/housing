import { Elysia, t } from "elysia";
import { and, eq } from "drizzle-orm";
import { dbPlugin } from "../plugins/db.ts";
import { sessionAuth } from "../auth/middleware.ts";
import { dormTable, reviewTable } from "../db/schema.ts";
import { reviewBody, slugParams } from "./review-input.ts";
import {
  errorResponse,
  findDorm,
  newestFirst,
  ownReview,
  reviewColumns,
  toReview,
} from "./review-shared.ts";

export const myReviewsRoute = new Elysia({ prefix: "/me" })
  .use(dbPlugin)
  .use(sessionAuth)

  .get(
    "/reviews",
    async ({ db, set, user }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const rows = await db
        .select({ ...reviewColumns, dormName: dormTable.name, dormSlug: dormTable.slug })
        .from(reviewTable)
        .innerJoin(dormTable, eq(dormTable.id, reviewTable.dormId))
        .where(eq(reviewTable.userId, user.id))
        .orderBy(...newestFirst);

      return rows.map((row) =>
        Object.assign(toReview(row), { dorm: { name: row.dormName, slug: row.dormSlug } }),
      );
    },
    { response: { 200: t.Array(ownReview), 401: errorResponse } },
  )

  .get(
    "/reviews/:slug",
    async ({ db, params, set, user }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      const dorm = await findDorm(db, params.slug);
      if (!dorm) {
        set.status = 404;
        return { error: "Dorm not found" };
      }

      const rows = await db
        .select(reviewColumns)
        .from(reviewTable)
        .where(and(eq(reviewTable.userId, user.id), eq(reviewTable.dormId, dorm.id)))
        .limit(1);
      const review = rows.at(0);

      return review ? { ...review, dorm: { name: dorm.name, slug: dorm.slug } } : null;
    },
    {
      params: slugParams,
      response: {
        200: t.Union([ownReview, t.Null()]),
        401: errorResponse,
        404: errorResponse,
      },
    },
  )

  .put(
    "/reviews/:slug",
    async ({ body, db, params, set, user }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      const dorm = await findDorm(db, params.slug);
      if (!dorm) {
        set.status = 404;
        return { error: "Dorm not found" };
      }

      const values = {
        body: body.body,
        livedTerm: body.livedTerm,
        livedYear: body.livedYear,
        ratingAmenities: body.ratingAmenities,
        ratingNoise: body.ratingNoise,
        ratingOverall: body.ratingOverall,
        ratingRoomQuality: body.ratingRoomQuality,
        ratingSocialLife: body.ratingSocialLife,
      };

      const rows = await db
        .insert(reviewTable)
        .values({ ...values, dormId: dorm.id, userId: user.id })
        .onConflictDoUpdate({
          set: { ...values, submittedAt: new Date() },
          target: [reviewTable.userId, reviewTable.dormId],
        })
        .returning(reviewColumns);
      const saved = rows.at(0);

      if (!saved) throw new Error("Saving the review returned no row");
      return { ...saved, dorm: { name: dorm.name, slug: dorm.slug } };
    },
    {
      body: reviewBody,
      params: slugParams,
      response: { 200: ownReview, 401: errorResponse, 404: errorResponse },
    },
  )

  .delete(
    "/reviews/:slug",
    async ({ db, params, set, user }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      const dorm = await findDorm(db, params.slug);
      if (!dorm) {
        set.status = 404;
        return { error: "Dorm not found" };
      }

      const deleted = await db
        .delete(reviewTable)
        .where(and(eq(reviewTable.userId, user.id), eq(reviewTable.dormId, dorm.id)))
        .returning({ id: reviewTable.id });

      if (deleted.length === 0) {
        set.status = 404;
        return { error: "Review not found" };
      }
      return { deleted: true };
    },
    {
      params: slugParams,
      response: {
        200: t.Object({ deleted: t.Boolean() }),
        401: errorResponse,
        404: errorResponse,
      },
    },
  );
