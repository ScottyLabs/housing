// oxlint-disable-next-line typescript/triple-slash-reference -- Deno needs a file reference for the local Node types.
/// <reference path="../../../../node_modules/@types/node/index.d.ts" />

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import type { CampusBuilding, Dorm } from "../db/schema.ts";
import { toBuilding, toCampusBuilding } from "./buildings.ts";

const noReviews = {
  averages: { amenities: null, atmosphere: null, overall: null, roomQuality: null },
  count: 0,
};

const dorm: Dorm = {
  acDetails: null,
  acLevel: "window",
  bathroomDetails: "Shared by the floor",
  bathroomTypes: ["communal"],
  closeBuildings: ["baker-hall"],
  code: "MOE",
  floorPlans: [],
  genderHousing: "co_ed",
  groundFloorRooms: false,
  gymAvailable: false,
  gymDetails: null,
  hasLounge: true,
  housingClasses: ["first_year"],
  id: 7,
  imageUrl: "https://example.com/etower.jpg",
  kitchenDescription: null,
  kitchenScope: "shared",
  latitude: 40.4,
  laundryDetails: null,
  laundryLocation: "basement",
  locationNote: null,
  longitude: -79.9,
  loungeDescription: null,
  name: "E Tower",
  noiseLevel: null,
  photoGallery: [{ description: "Double", link: "/double.jpg" }],
  roomTypes: ["trad_single", "trad_double"],
  serviceAnimalFriendly: true,
  slug: "etower",
  socialness: 4,
  strobeAlarm: false,
  tags: ["quiet"],
  updatedAt: null,
  wheelchairAccessible: true,
};

void test("toBuilding nests the dorm columns and uses the slug as the id", () => {
  const building = toBuilding(dorm, noReviews);

  strictEqual(building.id, "etower");
  strictEqual(building.code, "MOE");
  deepStrictEqual(building.housingClasses, ["first_year"]);
  deepStrictEqual(building.amenities.roomTypes, ["trad_single", "trad_double"]);
  deepStrictEqual(building.amenities.bathrooms, {
    details: "Shared by the floor",
    types: ["communal"],
  });
  strictEqual(building.accessibility.wheelchairAccessible, true);
  deepStrictEqual(building.media.photos, [{ description: "Double", link: "/double.jpg" }]);
  deepStrictEqual(building.editorialTags, ["quiet"]);
});

void test("toBuilding leaves out details and atmosphere values that are null", () => {
  const building = toBuilding(dorm, noReviews);

  deepStrictEqual(building.amenities.ac, { level: "window" });
  deepStrictEqual(building.atmosphere, { socialness: 4 });
  deepStrictEqual(building.location, {
    closeBuildings: ["baker-hall"],
    latitude: 40.4,
    longitude: -79.9,
  });
});

void test("toBuilding falls back to empty lists and carries the review summary", () => {
  const reviews = {
    averages: { amenities: 4, atmosphere: 3.5, overall: 4.25, roomQuality: 3 },
    count: 4,
  };
  const sparse: Dorm = {
    ...dorm,
    closeBuildings: null,
    imageUrl: null,
    photoGallery: null,
    tags: null,
  };
  const building = toBuilding(sparse, reviews);

  deepStrictEqual(building.location.closeBuildings, []);
  strictEqual(building.media.mainImage, "");
  deepStrictEqual(building.media.photos, []);
  deepStrictEqual(building.editorialTags, []);
  deepStrictEqual(building.reviews, reviews);
});

void test("toCampusBuilding renames slug to id and drops a missing subtitle", () => {
  const campus: CampusBuilding = {
    code: "BH",
    id: 3,
    latitude: 40.44,
    longitude: -79.94,
    name: "Baker Hall",
    slug: "baker-hall",
    subtitle: null,
  };

  deepStrictEqual(toCampusBuilding(campus), {
    code: "BH",
    id: "baker-hall",
    latitude: 40.44,
    longitude: -79.94,
    name: "Baker Hall",
  });
  strictEqual(toCampusBuilding({ ...campus, subtitle: "Science" }).subtitle, "Science");
});
