import { z } from "zod";
import { isSchoolYear, SCHOOL_YEAR_PATTERN } from "../utils/reviews.ts";

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

export const REVIEW_MAX_LENGTH = 5000;

const livedTerm = z.enum(["first-year", "sophomore", "junior", "senior", "graduate"]);

const livedYear = z
  .string()
  .regex(SCHOOL_YEAR_PATTERN)
  .refine((value) => isSchoolYear(value, new Date()), "Use two consecutive years, like 2024/2025");

const rating = z.int().min(1).max(5);

export const reviewBody = z.object({
  body: z.string().trim().min(1).max(REVIEW_MAX_LENGTH),
  livedTerm,
  livedYear,
  ratingAmenities: rating,
  ratingNoise: rating,
  ratingOverall: rating,
  ratingRoomQuality: rating,
  ratingSocialLife: rating,
});

export const slugParams = z.object({ slug: z.string() });

export const pageQuery = z.object({
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});
