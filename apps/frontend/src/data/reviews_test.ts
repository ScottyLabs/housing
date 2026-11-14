// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import {
  classYearLabel,
  emptyDraft,
  formatReviewDate,
  livedHereText,
  reviewCardRatings,
  schoolYearOptions,
  stepProblem,
  summaryCardRatings,
  toClassYear,
  toDormReview,
} from "./reviews.ts";

const labels = (date: Date) => schoolYearOptions(date).map((option) => option.label);

void test("schoolYearOptions starts a new school year in August", () => {
  deepStrictEqual(labels(new Date(2026, 10, 13)).slice(0, 2), ["2026/2027", "2025/2026"]);
  deepStrictEqual(labels(new Date(2026, 7, 1)).slice(0, 1), ["2026/2027"]);
  deepStrictEqual(labels(new Date(2026, 6, 31)).slice(0, 1), ["2025/2026"]);
});

void test("schoolYearOptions lists six school years, newest first", () => {
  deepStrictEqual(labels(new Date(2026, 2, 1)), [
    "2025/2026",
    "2024/2025",
    "2023/2024",
    "2022/2023",
    "2021/2022",
    "2020/2021",
  ]);
});

void test("classYearLabel shows the label for a stored class year", () => {
  strictEqual(classYearLabel("first-year"), "First Year");
  strictEqual(classYearLabel("graduate"), "Graduate");
  strictEqual(classYearLabel(null), undefined);
});

const rated = {
  ratingAmenities: 4,
  ratingNoise: 2,
  ratingOverall: 5,
  ratingRoomQuality: 3,
  ratingSocialLife: 5,
};

void test("reviewCardRatings shows Atmosphere as the average of Social Life and Quietness, rounded up", () => {
  deepStrictEqual(reviewCardRatings(rated), {
    amenities: 4,
    atmosphere: 4,
    overall: 5,
    roomQuality: 3,
  });
  strictEqual(reviewCardRatings({ ...rated, ratingNoise: 1, ratingSocialLife: 1 }).atmosphere, 1);
  strictEqual(reviewCardRatings({ ...rated, ratingNoise: 4, ratingSocialLife: 4 }).atmosphere, 4);
  strictEqual(reviewCardRatings({ ...rated, ratingNoise: 2, ratingSocialLife: 3 }).atmosphere, 3);
});

void test("reviewCardRatings has no Atmosphere for a review without both ratings", () => {
  strictEqual(reviewCardRatings({ ...rated, ratingNoise: null }).atmosphere, null);
  strictEqual(reviewCardRatings({ ...rated, ratingSocialLife: null }).atmosphere, null);
});

void test("summaryCardRatings averages the two Atmosphere averages without rounding", () => {
  const averages = { amenities: 4, noise: 2.5, overall: 4.5, roomQuality: 3, socialLife: 3.5 };
  deepStrictEqual(summaryCardRatings(averages), {
    amenities: 4,
    atmosphere: 3,
    overall: 4.5,
    roomQuality: 3,
  });
  strictEqual(summaryCardRatings({ ...averages, noise: 2, socialLife: 3.5 }).atmosphere, 2.75);
  strictEqual(summaryCardRatings({ ...averages, noise: null, socialLife: null }).atmosphere, null);
});

void test("toClassYear only accepts the values the server takes", () => {
  for (const year of ["first-year", "sophomore", "junior", "senior", "graduate"]) {
    strictEqual(toClassYear(year), year);
  }
  strictEqual(toClassYear("Junior"), undefined);
  strictEqual(toClassYear(""), undefined);
});

void test("stepProblem needs both years before part 2 and some text before posting", () => {
  strictEqual(typeof stepProblem(1, emptyDraft), "string");
  strictEqual(typeof stepProblem(1, { ...emptyDraft, classYear: "junior" }), "string");
  strictEqual(
    stepProblem(1, { ...emptyDraft, classYear: "junior", schoolYear: "2024/2025" }),
    undefined,
  );
  strictEqual(stepProblem(2, emptyDraft), undefined);
  strictEqual(typeof stepProblem(3, { ...emptyDraft, body: "   " }), "string");
  strictEqual(stepProblem(3, { ...emptyDraft, body: "Loved it" }), undefined);
});

void test("livedHereText combines the class year label and school year", () => {
  strictEqual(livedHereText("first-year", "2023/2024"), "Lived here First Year, 2023/2024");
  strictEqual(livedHereText(null, "2023/2024"), "Lived here 2023/2024");
  strictEqual(livedHereText("Fall", null), "Lived here Fall");
  strictEqual(livedHereText(null, null), undefined);
});

void test("formatReviewDate matches the cards' short date", () => {
  strictEqual(formatReviewDate(new Date(2025, 1, 5)), "2/5/25");
});

void test("toDormReview converts loosely typed API values", () => {
  const review = toDormReview({
    authorName: "Jane D.",
    body: null,
    id: "7",
    isMine: false,
    livedTerm: "junior",
    livedYear: "2024/2025",
    ratingAmenities: "4",
    ratingNoise: 5,
    ratingOverall: null,
    ratingRoomQuality: 2,
    ratingSocialLife: "3",
    submittedAt: "2025-02-05T12:00:00.000Z",
  });
  strictEqual(review.id, 7);
  strictEqual(review.body, "");
  deepStrictEqual(review.ratings, {
    ratingAmenities: 4,
    ratingNoise: 5,
    ratingOverall: null,
    ratingRoomQuality: 2,
    ratingSocialLife: 3,
  });
  strictEqual(review.submittedAt?.toISOString(), "2025-02-05T12:00:00.000Z");
  const undated = toDormReview({
    authorName: "Ravi",
    body: "x",
    id: 1,
    isMine: true,
    livedTerm: null,
    livedYear: null,
    ratingAmenities: null,
    ratingNoise: null,
    ratingOverall: null,
    ratingRoomQuality: null,
    ratingSocialLife: null,
    submittedAt: {},
  });
  strictEqual(undated.submittedAt, null);
});
