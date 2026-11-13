// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { classYearLabel, emptyDraft, schoolYearOptions, stepProblem } from "./reviews.ts";

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
