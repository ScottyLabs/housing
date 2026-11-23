import {
  type Building,
  type CampusBuilding,
  type FilterState,
  featureFilters,
  GenderHousing,
} from "./buildingTypes";
import { metersBetween } from "./distance";
import { buildingHasFeature } from "./features";
import { CARD_ROWS, type CardRow, noRatings } from "./reviews";

export const defaultFilters: FilterState = {
  distanceFrom: "",
  minRatings: noRatings,
  genderHousing: null,
  serviceAnimal: false,
  wheelchairAccessible: false,
  groundFloor: false,
  singleRoom: false,
  doubleRoom: false,
  tripleOrLarger: false,
  studioApartment: false,
  airConditioning: false,
  centralAC: false,
  laundryEachFloor: false,
  enSuiteBathroom: false,
  privateBathroom: false,
  enSuiteKitchen: false,
  kitchenAccess: false,
  commonAreas: false,
  gym: false,
};

// Best Fit is the top of the ranking, Decent Fit the next few, and Wild Card everything after.
const BEST_FIT_COUNT = 3;
const DECENT_FIT_COUNT = 6;

const RATING_MAX_SCORE = 2;
const PROXIMITY_MAX_SCORE = 2;
const PROXIMITY_RANGE_METERS = 800;

export interface BuildingGroups {
  bestFit: Building[];
  decentFit: Building[];
  wildCard: Building[];
}

function amenityScore(building: Building, filters: FilterState): number {
  const matched = featureFilters.filter(
    (feature) => filters[feature] && buildingHasFeature(building, feature),
  );
  const genderMatch =
    filters.genderHousing !== null && building.amenities.genderHousing === filters.genderHousing;
  return matched.length + (genderMatch ? 1 : 0);
}

export function withMinRating(filters: FilterState, row: CardRow, value: number): FilterState {
  return { ...filters, minRatings: { ...filters.minRatings, [row]: value === 0 ? null : value } };
}

function ratingScore(actual: number | null, minimum: number | null): number {
  if (actual === null || minimum === null) return 0;
  return Math.max(0, RATING_MAX_SCORE - Math.max(0, minimum - actual));
}

function ratingsScore(building: Building, filters: FilterState): number {
  return CARD_ROWS.reduce(
    (total, { key }) =>
      total + ratingScore(building.reviews.averages[key], filters.minRatings[key]),
    0,
  );
}

function proximityScore(building: Building, place: CampusBuilding | undefined): number {
  const { latitude, longitude } = building.location;
  if (place === undefined || latitude === undefined || longitude === undefined) return 0;
  const meters = metersBetween(latitude, longitude, place.latitude, place.longitude);
  return PROXIMITY_MAX_SCORE * Math.max(0, 1 - meters / PROXIMITY_RANGE_METERS);
}

export function scoreBuilding(
  building: Building,
  filters: FilterState,
  place: CampusBuilding | undefined,
): number {
  return (
    amenityScore(building, filters) +
    ratingsScore(building, filters) +
    proximityScore(building, place)
  );
}

function isEligible(building: Building, filters: FilterState): boolean {
  if (filters.genderHousing === null) return true;
  const housing = building.amenities.genderHousing;
  if (housing === GenderHousing.CoEd || housing === GenderHousing.GenderInclusive) return true;
  return housing === filters.genderHousing;
}

export function rankBuildings(
  buildings: Building[],
  filters: FilterState,
  campusBuildings: CampusBuilding[],
): Building[] {
  const place = campusBuildings.find((campus) => campus.id === filters.distanceFrom);
  const eligible = buildings.filter((building) => isEligible(building, filters));
  const scored = eligible.map((building) => ({
    building: building,
    score: scoreBuilding(building, filters, place),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.building);
}

export function groupBuildings(
  buildings: Building[],
  filters: FilterState,
  campusBuildings: CampusBuilding[],
): BuildingGroups {
  const ranked = rankBuildings(buildings, filters, campusBuildings);

  return {
    bestFit: ranked.slice(0, BEST_FIT_COUNT),
    decentFit: ranked.slice(BEST_FIT_COUNT, BEST_FIT_COUNT + DECENT_FIT_COUNT),
    wildCard: ranked.slice(BEST_FIT_COUNT + DECENT_FIT_COUNT),
  };
}
