// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import {
  BUILDING_CARD_ROWS,
  BUILDING_QUESTIONS,
  CARD_ROWS,
  classYearLabel,
  defaultRatings,
  emptyDraft,
  EXPERIENCE_CARD_ROWS,
  EXPERIENCE_QUESTIONS,
  formatReviewDate,
  livedHereText,
  reviewCardRatings,
  schoolYearOptions,
  stepProblem,
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
  ratingBathroomQuality: 2,
  ratingCommonSpaceQuality: 5,
  ratingNoise: 1,
  ratingOverall: 5,
  ratingRoomQuality: 3,
};

void test("reviewCardRatings maps each rating to its card row", () => {
  deepStrictEqual(reviewCardRatings(rated), {
    amenities: 4,
    bathroomQuality: 2,
    commonSpaceQuality: 5,
    noise: 1,
    overall: 5,
    roomQuality: 3,
  });
});

void test("reviewCardRatings leaves a row empty for a rating the review never gave", () => {
  const older = reviewCardRatings({
    ...rated,
    ratingBathroomQuality: null,
    ratingCommonSpaceQuality: null,
  });
  strictEqual(older.bathroomQuality, null);
  strictEqual(older.commonSpaceQuality, null);
  strictEqual(older.noise, 1);
});

void test("the card has a row for every rating it computes", () => {
  deepStrictEqual(
    new Set(CARD_ROWS.map(({ key }) => key)),
    new Set(Object.keys(reviewCardRatings(rated))),
  );
  strictEqual(CARD_ROWS.find(({ key }) => key === "noise")?.label, "Quietness");
});

void test("the rating filters have three sliders in each of their two sections", () => {
  strictEqual(EXPERIENCE_CARD_ROWS.length, 3);
  strictEqual(BUILDING_CARD_ROWS.length, 3);
  deepStrictEqual(CARD_ROWS, [...EXPERIENCE_CARD_ROWS, ...BUILDING_CARD_ROWS]);
});

void test("the two rating pages ask for every rating once, three to a page", () => {
  const asked = [...EXPERIENCE_QUESTIONS, ...BUILDING_QUESTIONS].map(({ key }) => key);
  strictEqual(EXPERIENCE_QUESTIONS.length, 3);
  strictEqual(BUILDING_QUESTIONS.length, 3);
  strictEqual(new Set(asked).size, asked.length);
  deepStrictEqual(new Set(asked), new Set(Object.keys(defaultRatings)));
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
  strictEqual(stepProblem(3, emptyDraft), undefined);
  strictEqual(typeof stepProblem(4, { ...emptyDraft, body: "   " }), "string");
  strictEqual(stepProblem(4, { ...emptyDraft, body: "Loved it" }), undefined);
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
    ratingBathroomQuality: "3",
    ratingCommonSpaceQuality: null,
    ratingNoise: 5,
    ratingOverall: null,
    ratingRoomQuality: 2,
    submittedAt: "2025-02-05T12:00:00.000Z",
  });
  strictEqual(review.id, 7);
  strictEqual(review.body, "");
  deepStrictEqual(review.ratings, {
    ratingAmenities: 4,
    ratingBathroomQuality: 3,
    ratingCommonSpaceQuality: null,
    ratingNoise: 5,
    ratingOverall: null,
    ratingRoomQuality: 2,
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
    ratingBathroomQuality: null,
    ratingCommonSpaceQuality: null,
    ratingNoise: null,
    ratingOverall: null,
    ratingRoomQuality: null,
    submittedAt: {},
  });
  strictEqual(undated.submittedAt, null);
});
