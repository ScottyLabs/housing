// Schemas and queries shared by the public review routes (reviews.ts) and the signed-in user's review routes (my-reviews.ts).
import { t } from "elysia";
import { avg, desc, eq } from "drizzle-orm";
import type { db as database } from "../db/index.ts";
import { dormTable, reviewTable } from "../db/schema.ts";
import { toAverage } from "../utils/reviews.ts";

type Db = typeof database;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

// Schemas

const rating = t.Integer({ minimum: 1, maximum: 5 });

export const reviewBody = t.Object({
  body: t.Optional(t.Nullable(t.String({ maxLength: 5000 }))),
  livedTerm: t.Optional(t.Nullable(t.String({ maxLength: 50 }))),
  livedYear: t.Optional(t.Nullable(t.String({ maxLength: 50 }))),
  ratingAmenities: rating,
  ratingNoise: rating,
  ratingOverall: rating,
  ratingRoomQuality: rating,
  ratingSocialLife: rating,
});

export const dormRef = t.Object({ name: t.String(), slug: t.String() });

const reviewFields = {
  body: t.Nullable(t.String()),
  id: t.Integer(),
  livedTerm: t.Nullable(t.String()),
  livedYear: t.Nullable(t.String()),
  ratingAmenities: t.Nullable(t.Integer()),
  ratingNoise: t.Nullable(t.Integer()),
  ratingOverall: t.Nullable(t.Integer()),
  ratingRoomQuality: t.Nullable(t.Integer()),
  ratingSocialLife: t.Nullable(t.Integer()),
  submittedAt: t.Nullable(t.Date()),
};

export const publicReview = t.Object({
  ...reviewFields,
  authorName: t.String(),
  isMine: t.Boolean(),
});

export const ownReview = t.Object({ ...reviewFields, dorm: dormRef });

export const ratingSummary = t.Object({
  averages: t.Object({
    amenities: t.Nullable(t.Number()),
    noise: t.Nullable(t.Number()),
    overall: t.Nullable(t.Number()),
    roomQuality: t.Nullable(t.Number()),
    socialLife: t.Nullable(t.Number()),
  }),
  count: t.Integer(),
});

export const dormSummary = t.Object({ ...ratingSummary.properties, dorm: dormRef });

export const errorResponse = t.Object({ error: t.String() });

export const slugParams = t.Object({ slug: t.String() });

export const pageQuery = t.Object({
  limit: t.Optional(t.Integer({ maximum: MAX_PAGE_SIZE, minimum: 1 })),
  offset: t.Optional(t.Integer({ minimum: 0 })),
});

// Queries

export const reviewColumns = {
  body: reviewTable.body,
  id: reviewTable.id,
  livedTerm: reviewTable.livedTerm,
  livedYear: reviewTable.livedYear,
  ratingAmenities: reviewTable.ratingAmenities,
  ratingNoise: reviewTable.ratingNoise,
  ratingOverall: reviewTable.ratingOverall,
  ratingRoomQuality: reviewTable.ratingRoomQuality,
  ratingSocialLife: reviewTable.ratingSocialLife,
  submittedAt: reviewTable.submittedAt,
};

export const newestFirst = [desc(reviewTable.submittedAt), desc(reviewTable.id)];

export const ratingAverages = {
  amenities: avg(reviewTable.ratingAmenities),
  noise: avg(reviewTable.ratingNoise),
  overall: avg(reviewTable.ratingOverall),
  roomQuality: avg(reviewTable.ratingRoomQuality),
  socialLife: avg(reviewTable.ratingSocialLife),
};

type ReviewRow = Pick<
  typeof reviewTable.$inferSelect,
  | "body"
  | "id"
  | "livedTerm"
  | "livedYear"
  | "ratingAmenities"
  | "ratingNoise"
  | "ratingOverall"
  | "ratingRoomQuality"
  | "ratingSocialLife"
  | "submittedAt"
>;

export function toReview(row: ReviewRow): ReviewRow {
  return {
    body: row.body,
    id: row.id,
    livedTerm: row.livedTerm,
    livedYear: row.livedYear,
    ratingAmenities: row.ratingAmenities,
    ratingNoise: row.ratingNoise,
    ratingOverall: row.ratingOverall,
    ratingRoomQuality: row.ratingRoomQuality,
    ratingSocialLife: row.ratingSocialLife,
    submittedAt: row.submittedAt,
  };
}

interface AverageRow {
  amenities: string | null;
  count: number;
  noise: string | null;
  overall: string | null;
  roomQuality: string | null;
  socialLife: string | null;
}

export const noReviews: AverageRow = {
  amenities: null,
  count: 0,
  noise: null,
  overall: null,
  roomQuality: null,
  socialLife: null,
};

export function toSummary(row: AverageRow) {
  return {
    averages: {
      amenities: toAverage(row.amenities),
      noise: toAverage(row.noise),
      overall: toAverage(row.overall),
      roomQuality: toAverage(row.roomQuality),
      socialLife: toAverage(row.socialLife),
    },
    count: row.count,
  };
}

export async function findDorm(db: Db, slug: string) {
  const rows = await db
    .select({ id: dormTable.id, name: dormTable.name, slug: dormTable.slug })
    .from(dormTable)
    .where(eq(dormTable.slug, slug))
    .limit(1);
  return rows.at(0);
}
