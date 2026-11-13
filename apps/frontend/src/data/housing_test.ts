// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, ok } from "node:assert/strict";
import { test } from "node:test";
import buildingsData from "./buildings.json" with { type: "json" };
import { type Building, HousingClass } from "./buildingTypes.ts";
import { buildingsForClass, housingClassForYear } from "./housing.ts";

// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Same JSON cast as data/buildings.ts.
const buildings = buildingsData as Building[];
const sortedIds = (list: Building[]) => list.map((building) => building.id).toSorted();

// From cmu.edu/housing/our-communities/first-year and /undergraduate.
const FIRST_YEAR_IDS = [
  "boss",
  "clyde",
  "donner",
  "etower",
  "fifth",
  "hamerschlag",
  "henderson",
  "maggiemo",
  "mcgill",
  "morewood",
  "mudge",
  "scobell",
  "stever",
  "welch",
];
const UPPERCLASS_IDS = [
  "fairfax",
  "fifthclyde",
  "fifthneville",
  "forbesbeeler",
  "highlands",
  "margaretmorrison",
  "morewood",
  "neville",
  "resnik",
  "roselawn",
  "spirit",
  "westwing",
  "woodlawn",
];

void test("first-year housing matches the CMU first-year page", () => {
  deepStrictEqual(sortedIds(buildingsForClass(buildings, HousingClass.FirstYear)), FIRST_YEAR_IDS);
});

void test("upperclass housing matches the CMU undergraduate page", () => {
  deepStrictEqual(sortedIds(buildingsForClass(buildings, HousingClass.Upperclass)), UPPERCLASS_IDS);
});

void test("Morewood Gardens is the only building in both classes", () => {
  const both = buildings.filter((building) => building.housingClasses.length > 1);

  deepStrictEqual(sortedIds(both), ["morewood"]);
});

void test("every building belongs to at least one class", () => {
  for (const building of buildings) {
    ok(building.housingClasses.length > 0, `${building.id} has no housing class`);
  }
});

void test("a survey year maps to the housing that student can live in", () => {
  deepStrictEqual(housingClassForYear("first-year"), HousingClass.FirstYear);
  for (const year of ["sophomore", "junior", "senior"]) {
    deepStrictEqual(housingClassForYear(year), HousingClass.Upperclass);
  }
  deepStrictEqual(housingClassForYear(null), null);
  deepStrictEqual(housingClassForYear("graduate"), null);
});
