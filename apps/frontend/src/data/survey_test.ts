// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import {
  ACCOMMODATIONS,
  AMENITIES,
  GENDER_ANSWERS,
  GENDER_OPTIONS,
  GOALS,
  keepOptions,
  pickOption,
  YEAR_ANSWERS,
  YEAR_OPTIONS,
} from "./survey.ts";

void test("the gender and year dropdowns offer the same choices as before", () => {
  deepStrictEqual(GENDER_OPTIONS, [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-Binary (male dorms)", value: "nb-male" },
    { label: "Non-Binary (female dorms)", value: "nb-female" },
    { label: "Non-Binary (gender inclusive)", value: "nb-inclusive" },
  ]);
  deepStrictEqual(YEAR_OPTIONS, [
    { label: "First-Year", value: "first-year" },
    { label: "Sophomore", value: "sophomore" },
    { label: "Junior", value: "junior" },
    { label: "Senior", value: "senior" },
  ]);
});

void test("the checkbox lists keep their labels and order", () => {
  deepStrictEqual([...GOALS], ["Exercise", "Cook", "Meet new people", "Study hard"]);
  deepStrictEqual(
    [...ACCOMMODATIONS],
    [
      "Service Animal",
      "En suite kitchen",
      "Ground floor room",
      "Strobe fire alarm & doorbell",
      "Wheelchair accessible",
      "Climate control: AC",
      "En suite bathroom",
      "Elevator access",
      "Single room",
      "Personal care assistant",
    ],
  );
  deepStrictEqual(
    [...AMENITIES],
    ["Air conditioning", "En suite bathroom", "En suite kitchen", "Common areas", "Kitchen access"],
  );
});

void test("pickOption keeps a known answer, clears an unknown one and skips an untouched one", () => {
  strictEqual(pickOption(YEAR_ANSWERS, "junior"), "junior");
  strictEqual(pickOption(YEAR_ANSWERS, ""), null);
  strictEqual(pickOption(YEAR_ANSWERS, "Junior"), null);
  strictEqual(pickOption(GENDER_ANSWERS, "other"), null);
  strictEqual(pickOption(GENDER_ANSWERS), undefined);
});

void test("keepOptions drops answers the server would not take", () => {
  deepStrictEqual(keepOptions(GOALS, ["Cook", "Fly", "Exercise"]), ["Cook", "Exercise"]);
  deepStrictEqual(keepOptions(GOALS, []), []);
  strictEqual(keepOptions(GOALS), undefined);
});
