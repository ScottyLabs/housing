// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { preferencesBody } from "./preferences-input.ts";

const valid = {
  accommodations: ["Service Animal", "Climate control: AC"],
  completed: true,
  cookingFrequency: 1,
  goals: ["Exercise", "Study hard"],
  gymFrequency: 2,
  major: "Information Systems",
  needsAloneTime: 3,
  preferredAmenities: ["Air conditioning"],
  preferredGenderHousing: "nb-inclusive",
  productiveAroundOthers: 4,
  socialFrequency: 5,
  year: "first-year",
};

function accepts(changes: Record<string, unknown>): boolean {
  return preferencesBody.safeParse({ ...valid, ...changes }).success;
}

void test("preferencesBody accepts a full set of answers and any single answer", () => {
  strictEqual(accepts({}), true);
  strictEqual(preferencesBody.safeParse({}).success, true);
  for (const [key, value] of Object.entries(valid)) {
    strictEqual(preferencesBody.safeParse({ [key]: value }).success, true, key);
  }
});

void test("preferencesBody lets answers be cleared with null", () => {
  const cleared = Object.fromEntries(
    Object.keys(valid)
      .filter((key) => key !== "completed")
      .map((key) => [key, null]),
  );
  strictEqual(preferencesBody.safeParse(cleared).success, true);
});

void test("preferencesBody only takes the options the survey offers", () => {
  strictEqual(accepts({ year: "freshman" }), false);
  strictEqual(accepts({ year: "Junior" }), false);
  strictEqual(accepts({ preferredGenderHousing: "other" }), false);
  strictEqual(accepts({ goals: ["Exercise", "Take over the world"] }), false);
  strictEqual(accepts({ accommodations: ["Moat"] }), false);
  strictEqual(accepts({ preferredAmenities: ["Pool"] }), false);
  for (const year of ["first-year", "sophomore", "junior", "senior"]) {
    strictEqual(accepts({ year }), true);
  }
});

void test("preferencesBody rejects an option picked twice", () => {
  strictEqual(accepts({ goals: ["Cook", "Cook"] }), false);
  strictEqual(accepts({ accommodations: ["Single room", "Single room"] }), false);
  strictEqual(accepts({ preferredAmenities: [] }), true);
});

void test("preferencesBody needs whole frequencies from 1 to 5", () => {
  for (const key of [
    "cookingFrequency",
    "gymFrequency",
    "needsAloneTime",
    "productiveAroundOthers",
    "socialFrequency",
  ]) {
    for (const value of [1, 5]) strictEqual(accepts({ [key]: value }), true);
    for (const value of [0, 6, -1, 2.5, "3", Number.NaN])
      strictEqual(accepts({ [key]: value }), false);
  }
});

void test("preferencesBody keeps major as trimmed text of a sensible length", () => {
  deepStrictEqual(preferencesBody.parse({ major: "  Art  " }), { major: "Art" });
  strictEqual(accepts({ major: "" }), false);
  strictEqual(accepts({ major: "   " }), false);
  strictEqual(accepts({ major: "x".repeat(101) }), false);
  strictEqual(accepts({ major: 7 }), false);
});

void test("preferencesBody only takes a true or false completed flag", () => {
  strictEqual(accepts({ completed: false }), true);
  strictEqual(accepts({ completed: "yes" }), false);
  strictEqual(accepts({ completed: null }), false);
});

void test("preferencesBody drops fields it does not know", () => {
  deepStrictEqual(preferencesBody.parse({ year: "senior", admin: true }), { year: "senior" });
});
