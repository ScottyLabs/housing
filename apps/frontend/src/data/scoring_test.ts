// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
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
import { CARD_ROWS, noRatings, type RatingAverages } from "./reviews.ts";
import {
  defaultFilters,
  groupBuildings,
  rankBuildings,
  scoreBuilding,
  withMinRating,
} from "./scoring.ts";

function withRatings(building: Building, averages: Partial<RatingAverages>): Building {
  return { ...building, reviews: { averages: { ...noRatings, ...averages }, count: 1 } };
}

// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Same JSON cast as data/buildings.ts.
const catalog = buildingsData as Building[];
const buildings = catalog.map((building) => withRatings(building, {}));
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

void test("a minimum rating ranks the better rated building first", () => {
  const strong = withRatings(buildings[0], { overall: 4.6 });
  const weak = withRatings(buildings[1], { overall: 2.1 });
  const filters = withMinRating(defaultFilters, "overall", 4);

  deepStrictEqual(ids(rankFor([weak, strong], filters)), [strong.id, weak.id]);
});

void test("a rating above the minimum scores the same as one that meets it", () => {
  const filters = withMinRating(defaultFilters, "noise", 4);
  const meets = scoreFor(withRatings(buildings[0], { noise: 4 }), filters);

  strictEqual(scoreFor(withRatings(buildings[0], { noise: 5 }), filters), meets);
  ok(scoreFor(withRatings(buildings[0], { noise: 3 }), filters) < meets);
});

void test("a building without ratings scores nothing for a rating filter", () => {
  const unrated = withRatings(buildings[0], {});

  strictEqual(
    scoreFor(unrated, withMinRating(defaultFilters, "overall", 5)),
    scoreFor(unrated, defaultFilters),
  );
});

void test("each rating filter reads only its own average", () => {
  const allFives = Object.fromEntries(CARD_ROWS.map(({ key }) => [key, 5]));
  for (const { key } of CARD_ROWS) {
    const filters = withMinRating(defaultFilters, key, 5);
    const rated = scoreFor(withRatings(buildings[0], { [key]: 5 }), filters);
    const others = scoreFor(withRatings(buildings[0], { ...allFives, [key]: null }), filters);

    ok(rated > others, `${key} should only count its own average`);
  }
});

void test("withMinRating sets one row and leaves the filters it was given alone", () => {
  const filters = withMinRating(withMinRating(defaultFilters, "noise", 4), "overall", 2);

  deepStrictEqual(filters.minRatings, { ...noRatings, noise: 4, overall: 2 });
  deepStrictEqual(defaultFilters.minRatings, noRatings);
});

void test("a minimum of 0 clears the rating filter", () => {
  const filters = withMinRating(withMinRating(defaultFilters, "noise", 4), "noise", 0);

  deepStrictEqual(filters.minRatings, noRatings);
});
