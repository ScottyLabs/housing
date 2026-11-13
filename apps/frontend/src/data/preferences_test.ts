// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, ok } from "node:assert/strict";
import { test } from "node:test";
import { preferencesToFilters } from "./preferences.ts";
import { defaultFilters } from "./scoring.ts";

const none = {
  accommodations: null,
  preferredAmenities: null,
  preferredGenderHousing: null,
  socialFrequency: null,
  year: null,
};

void test("no survey answers leave every filter off", () => {
  deepStrictEqual(preferencesToFilters(none), defaultFilters);
});

void test("survey accommodations and amenities turn on the matching filters", () => {
  const filters = preferencesToFilters({
    ...none,
    accommodations: ["Ground floor room", "En suite kitchen"],
    preferredAmenities: ["Common areas", "Kitchen access"],
  });

  ok(filters.groundFloor);
  ok(filters.enSuiteKitchen);
  ok(filters.commonAreas);
  ok(filters.kitchenAccess);
  ok(!filters.centralAC);
});
