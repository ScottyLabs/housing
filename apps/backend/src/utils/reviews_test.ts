// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../../../node_modules/@types/node/index.d.ts" />

import { strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { displayName, isSchoolYear, toAverage } from "./reviews.ts";

void test("displayName shortens the last name to an initial", () => {
  strictEqual(displayName("Jane Q. Doe"), "Jane D.");
  strictEqual(displayName("  ravi   kumar "), "ravi K.");
  strictEqual(displayName("Ravi"), "Ravi");
});

void test("displayName hides Andrew IDs and missing names", () => {
  strictEqual(displayName("jdoe", "jdoe"), "CMU Student");
  strictEqual(displayName("Unknown", "jdoe"), "CMU Student");
  strictEqual(displayName("   "), "CMU Student");
});

void test("toAverage rounds Postgres numeric strings to two decimals", () => {
  strictEqual(toAverage("3.6666666666666667"), 3.67);
  strictEqual(toAverage("4.0000000000000000"), 4);
  strictEqual(toAverage(null), null);
});

void test("isSchoolYear accepts two consecutive years up to the current one", () => {
  const today = new Date(2026, 10, 14);
  strictEqual(isSchoolYear("2026/2027", today), true);
  strictEqual(isSchoolYear("2025/2026", today), true);
  strictEqual(isSchoolYear("2027/2028", today), false);
  strictEqual(isSchoolYear("2025/2027", today), false);
  strictEqual(isSchoolYear("2026-2027", today), false);
  strictEqual(isSchoolYear("1999/2000", today), false);
  strictEqual(isSchoolYear("max is the best", today), false);
});
