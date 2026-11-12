// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, ok } from "node:assert/strict";
import { test } from "node:test";
import buildingsData from "./buildings.json" with { type: "json" };
import type { Building, FilterState } from "./buildingTypes.ts";
import { campusBuildings } from "./campusBuildings.ts";
import { defaultFilters, groupBuildings, rankBuildings, scoreBuilding } from "./scoring.ts";

// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Same JSON cast as data/buildings.ts.
const buildings = buildingsData as Building[];
const ids = (list: Building[]) => list.map((building) => building.id);

const preferences: FilterState = {
  ...defaultFilters,
  airConditioning: true,
  laundryEachFloor: true,
  socialness: 4,
};

// "See More" lists a whole category, so its order has to match the ranking behind the previews.
void test("categories are consecutive slices of the preference ranking", () => {
  const ranked = rankBuildings(buildings, preferences);
  const { bestFit, decentFit, wildCard } = groupBuildings(buildings, preferences);

  deepStrictEqual(ids([...bestFit, ...decentFit, ...wildCard]), ids(ranked));
  ok(decentFit.length > 3, "Decent Fit should hold more than the three previewed buildings");
  ok(wildCard.length > 3, "Wild Card should hold every building past the first two groups");
});

void test("buildings are ordered from the best match to the worst", () => {
  const scores = rankBuildings(buildings, preferences).map((building) =>
    scoreBuilding(building, preferences),
  );

  ok(new Set(scores).size > 1, "the preferences should separate the buildings");
  ok(
    scores.every((score, index) => index === 0 || scores[index - 1] >= score),
    `scores should never increase down the list: ${scores.join(", ")}`,
  );
});

void test("buildings keep their catalog order when no preference is set", () => {
  deepStrictEqual(ids(rankBuildings(buildings, defaultFilters)), ids(buildings));
});

void test("buildings nearer the chosen campus building rank first", () => {
  const nearGates: FilterState = { ...defaultFilters, distanceFrom: "gates-hillman" };
  const ranked = ids(rankBuildings(buildings, nearGates));

  ok(ranked.indexOf("etower") < ranked.indexOf("boss"), "E Tower is closer to Gates than Boss");
  ok(
    scoreBuilding(buildings[0], nearGates) > scoreBuilding(buildings[0], defaultFilters),
    "a nearby building should score above the same building with no place chosen",
  );
});

void test("every close building is a listed campus building", () => {
  const campusIds = new Set(campusBuildings.map((campus) => campus.id));
  for (const building of buildings) {
    ok(building.location.closeBuildings.length > 0, `${building.id} has no close buildings`);
    for (const id of building.location.closeBuildings) {
      ok(campusIds.has(id), `${building.id} lists unknown campus building "${id}"`);
    }
  }
});
