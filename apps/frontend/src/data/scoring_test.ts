// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, ok } from "node:assert/strict";
import { test } from "node:test";
import buildingsData from "./buildings.json" with { type: "json" };
import {
  type Building,
  type CampusBuilding,
  type FilterState,
  featureFilters,
} from "./buildingTypes.ts";
import campusBuildingsData from "./campusBuildings.json" with { type: "json" };
import { buildingHasFeature } from "./features.ts";
import { defaultFilters, groupBuildings, rankBuildings, scoreBuilding } from "./scoring.ts";

// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Same JSON cast as data/buildings.ts.
const buildings = buildingsData as Building[];
// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Same JSON cast as data/buildings.json above.
const campusBuildings = campusBuildingsData as CampusBuilding[];
const ids = (list: Building[]) => list.map((building) => building.id);

const rankFor = (list: Building[], filters: FilterState) =>
  rankBuildings(list, filters, campusBuildings);
const scoreFor = (building: Building, filters: FilterState) =>
  scoreBuilding(
    building,
    filters,
    campusBuildings.find((campus) => campus.id === filters.distanceFrom),
  );

const preferences: FilterState = {
  ...defaultFilters,
  airConditioning: true,
  laundryEachFloor: true,
  socialness: 4,
};

// "See More" lists a whole category, so its order has to match the ranking behind the previews.
void test("categories are consecutive slices of the preference ranking", () => {
  const ranked = rankFor(buildings, preferences);
  const { bestFit, decentFit, wildCard } = groupBuildings(buildings, preferences, campusBuildings);

  deepStrictEqual(ids([...bestFit, ...decentFit, ...wildCard]), ids(ranked));
  ok(decentFit.length > 3, "Decent Fit should hold more than the three previewed buildings");
  ok(wildCard.length > 3, "Wild Card should hold every building past the first two groups");
});

void test("buildings are ordered from the best match to the worst", () => {
  const scores = rankFor(buildings, preferences).map((building) => scoreFor(building, preferences));

  ok(new Set(scores).size > 1, "the preferences should separate the buildings");
  ok(
    scores.every((score, index) => index === 0 || scores[index - 1] >= score),
    `scores should never increase down the list: ${scores.join(", ")}`,
  );
});

void test("buildings keep their catalog order when no preference is set", () => {
  deepStrictEqual(ids(rankFor(buildings, defaultFilters)), ids(buildings));
});

void test("buildings nearer the chosen campus building rank first", () => {
  const nearGates: FilterState = { ...defaultFilters, distanceFrom: "gates-hillman" };
  const ranked = ids(rankFor(buildings, nearGates));

  ok(ranked.indexOf("etower") < ranked.indexOf("boss"), "E Tower is closer to Gates than Boss");
  ok(
    scoreFor(buildings[0], nearGates) > scoreFor(buildings[0], defaultFilters),
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

void test("every building has a short code, unique apart from housing that is also a campus building", () => {
  const housingIds = new Set(buildings.map((building) => building.id));
  const seen = new Map<string, string>();
  const entries = [
    ...buildings.map((building) => ({ id: building.id, code: building.code })),
    ...campusBuildings
      .filter((campus) => !housingIds.has(campus.id))
      .map((campus) => ({ id: campus.id, code: campus.code })),
  ];
  for (const { id, code } of entries) {
    ok(code !== "", `${id} has no code`);
    ok(!seen.has(code), `${id} reuses code "${code}" of ${seen.get(code) ?? ""}`);
    seen.set(code, id);
  }
});

void test("every feature filter is held by some building and ranks one first", () => {
  for (const feature of featureFilters) {
    ok(
      buildings.some((building) => buildingHasFeature(building, feature)),
      `no building has "${feature}", so the filter could never match`,
    );
    const top = rankFor(buildings, { ...defaultFilters, [feature]: true }).at(0);
    ok(
      top !== undefined && buildingHasFeature(top, feature),
      `"${feature}" should put a building that has it first`,
    );
  }
});

void test("turning on more filters never lowers a matching building's score", () => {
  const building = buildings[0];
  const all: FilterState = { ...defaultFilters };
  for (const feature of featureFilters) all[feature] = true;
  ok(scoreFor(building, all) >= scoreFor(building, defaultFilters));
});
