// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, strictEqual, throws } from "node:assert/strict";
import { test } from "node:test";
import { type ApiBuilding, toBuilding } from "./apiBuildings.ts";
import buildingsData from "./buildings.json" with { type: "json" };

const noReviews = {
  averages: { amenities: null, noise: null, overall: null, roomQuality: null, socialLife: null },
  count: 0,
};

// The API returns the same fields as buildings.json, plus the review summary.
function toApi(index: number): ApiBuilding {
  const raw = buildingsData[index];
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- The JSON holds the same fields as the API response.
  return { ...raw, editorialTags: raw.editorialTags ?? [], reviews: noReviews } as ApiBuilding;
}

void test("every building in the catalog converts to a frontend Building", () => {
  for (const [index, raw] of buildingsData.entries()) {
    const building = toBuilding(toApi(index));

    strictEqual(building.id, raw.id);
    strictEqual(building.code, raw.code);
    deepStrictEqual([...building.housingClasses], raw.housingClasses);
    deepStrictEqual([...building.amenities.roomTypes], raw.amenities.roomTypes);
    strictEqual(building.amenities.ac.level, raw.amenities.ac.level);
    deepStrictEqual(building.media, raw.media);
    deepStrictEqual(building.location, raw.location);
  }
});

void test("review counts that arrive as strings become numbers", () => {
  const api = toApi(0);
  const reviews = { averages: { ...noReviews.averages, overall: 4.5 }, count: "3" };
  const building = toBuilding({ ...api, reviews });

  strictEqual(building.reviews.count, 3);
  strictEqual(building.reviews.averages.overall, 4.5);
});

void test("an enum value the frontend does not know is rejected", () => {
  const api = toApi(0);
  const ac = Object.assign({}, api.amenities.ac, { level: "geothermal" });
  const drifted: ApiBuilding = { ...api, amenities: { ...api.amenities, ac } };

  throws(() => toBuilding(drifted), /ac level: unexpected value "geothermal"/u);
});
