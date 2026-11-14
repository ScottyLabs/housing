// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { pageQuery, REVIEW_MAX_LENGTH, reviewBody } from "./review-input.ts";

const valid = {
  body: "Great dorm",
  livedTerm: "junior",
  livedYear: "2025/2026",
  ratingAmenities: 4,
  ratingNoise: 2,
  ratingOverall: 5,
  ratingRoomQuality: 3,
  ratingSocialLife: 1,
};

function accepts(changes: Record<string, unknown>): boolean {
  return reviewBody.safeParse({ ...valid, ...changes }).success;
}

void test("reviewBody accepts a complete review and trims the text", () => {
  const result = reviewBody.safeParse({ ...valid, body: "  Great dorm  " });
  strictEqual(result.success, true);
  strictEqual(result.data?.body, "Great dorm");
});

void test("reviewBody drops fields it does not know", () => {
  const result = reviewBody.safeParse({ ...valid, extra: "x", ratingAtmosphere: 3 });
  deepStrictEqual(result.data, valid);
});

void test("reviewBody only takes the class years the form offers", () => {
  for (const term of ["first-year", "sophomore", "junior", "senior", "graduate"]) {
    strictEqual(accepts({ livedTerm: term }), true);
  }
  for (const term of ["haha", "Junior", "", null, 3]) {
    strictEqual(accepts({ livedTerm: term }), false);
  }
});

void test("reviewBody only takes real school years", () => {
  strictEqual(accepts({ livedYear: "2024/2025" }), true);
  for (const year of ["max is the best", "2024-2025", "2024/2026", "2099/2100", "", null]) {
    strictEqual(accepts({ livedYear: year }), false);
  }
});

void test("reviewBody needs whole ratings from 1 to 5", () => {
  for (const key of Object.keys(valid).filter((name) => name.startsWith("rating"))) {
    strictEqual(accepts({ [key]: 1 }), true);
    strictEqual(accepts({ [key]: 5 }), true);
    for (const value of [0, 6, -1, 2.5, "3", null, Number.NaN]) {
      strictEqual(accepts({ [key]: value }), false);
    }
  }
});

void test("reviewBody needs a written review within the length limit", () => {
  strictEqual(accepts({ body: "x".repeat(REVIEW_MAX_LENGTH) }), true);
  for (const body of ["", "   ", null, "x".repeat(REVIEW_MAX_LENGTH + 1)]) {
    strictEqual(accepts({ body }), false);
  }
});

void test("reviewBody needs every field", () => {
  for (const key of Object.keys(valid)) {
    const rest = Object.fromEntries(Object.entries(valid).filter(([name]) => name !== key));
    strictEqual(reviewBody.safeParse(rest).success, false);
  }
});

void test("pageQuery reads numbers from the query string and limits them", () => {
  deepStrictEqual(pageQuery.parse({ limit: "5", offset: "10" }), { limit: 5, offset: 10 });
  deepStrictEqual(pageQuery.parse({}), {});
  for (const query of [{ limit: "0" }, { limit: "51" }, { limit: "abc" }, { offset: "-1" }]) {
    strictEqual(pageQuery.safeParse(query).success, false);
  }
});
