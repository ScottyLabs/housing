// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../../../node_modules/@types/node/index.d.ts" />

import { strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { cleanText, displayName, toAverage } from "./reviews.ts";

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

void test("cleanText trims text and turns blanks into null", () => {
  strictEqual(cleanText("  great dorm  "), "great dorm");
  strictEqual(cleanText("   "), null);
  strictEqual(cleanText(""), null);
  strictEqual(cleanText(null), null);
  strictEqual(cleanText(), null);
});
