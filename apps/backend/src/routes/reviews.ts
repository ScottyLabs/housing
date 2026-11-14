import { Elysia, t } from "elysia";
import { count, eq } from "drizzle-orm";
import { dbPlugin } from "../plugins/db.ts";
import { sessionAuth } from "../auth/middleware.ts";
import { dormTable, reviewTable, userTable } from "../db/schema.ts";
import { displayName } from "../utils/reviews.ts";
import { DEFAULT_PAGE_SIZE, pageQuery, slugParams } from "./review-input.ts";
import {
  dormRef,
  dormSummary,
  errorResponse,
  findDorm,
  newestFirst,
  noReviews,
  publicReview,
  ratingAverages,
  ratingSummary,
  reviewColumns,
  toReview,
  toSummary,
} from "./review-shared.ts";

export const reviewsRoute = new Elysia()
  .use(dbPlugin)
  .use(sessionAuth)

  // Average ratings and review counts for every dorm, for building cards and comparisons.
  .get(
    "/reviews/summary",
    async ({ db }) => {
      const rows = await db
        .select({
          ...ratingAverages,
          count: count(reviewTable.id),
          name: dormTable.name,
          slug: dormTable.slug,
        })
        .from(dormTable)
        .leftJoin(reviewTable, eq(reviewTable.dormId, dormTable.id))
        .groupBy(dormTable.id)
        .orderBy(dormTable.name);

      return rows.map((row) =>
        Object.assign(toSummary(row), { dorm: { name: row.name, slug: row.slug } }),
      );
    },
    { response: { 200: t.Array(dormSummary) } },
  )

  // One dorm's summary and a page of its reviews, newest first.
  .get(
    "/dorms/:slug/reviews",
    async ({ db, params, query, set, user }) => {
      const dorm = await findDorm(db, params.slug);
      if (!dorm) {
        set.status = 404;
        return { error: "Dorm not found" };
      }

      const summaryRows = await db
        .select({ ...ratingAverages, count: count() })
        .from(reviewTable)
        .where(eq(reviewTable.dormId, dorm.id));

      const rows = await db
        .select({
          ...reviewColumns,
          authorAndrewId: userTable.andrewId,
          authorFullName: userTable.name,
          userId: reviewTable.userId,
        })
        .from(reviewTable)
        .innerJoin(userTable, eq(userTable.id, reviewTable.userId))
        .where(eq(reviewTable.dormId, dorm.id))
        .orderBy(...newestFirst)
        .limit(query.limit ?? DEFAULT_PAGE_SIZE)
        .offset(query.offset ?? 0);

      const reviews = rows.map((row) =>
        Object.assign(toReview(row), {
          authorName: displayName(row.authorFullName, row.authorAndrewId),
          isMine: user?.id === row.userId,
        }),
      );

      return {
        dorm: { name: dorm.name, slug: dorm.slug },
        reviews,
        summary: toSummary(summaryRows.at(0) ?? noReviews),
      };
    },
    {
      params: slugParams,
      query: pageQuery,
      response: {
        200: t.Object({ dorm: dormRef, reviews: t.Array(publicReview), summary: ratingSummary }),
        404: errorResponse,
      },
    },
  );
