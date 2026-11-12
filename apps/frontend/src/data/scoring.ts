import {
  ACLevel,
  BathroomType,
  type Building,
  type FilterState,
  GenderHousing,
  LaundryLocation,
  RoomType,
} from "./buildingTypes";
import { campusBuildings } from "./campusBuildings";

export const defaultFilters: FilterState = {
  distanceFrom: "",
  socialness: null,
  noiseLevel: null,
  serviceAnimal: false,
  wheelchairAccessible: false,
  singleRoom: false,
  airConditioning: false,
  laundryEachFloor: false,
  enSuiteBathroom: false,
  genderHousing: null,
};

// Best Fit is the top of the ranking, Decent Fit the next few, and Wild Card everything after.
const BEST_FIT_COUNT = 3;
const DECENT_FIT_COUNT = 6;

const PROXIMITY_MAX_SCORE = 2;
const PROXIMITY_RANGE_METERS = 800;
const EARTH_RADIUS_METERS = 6_371_000;

export interface BuildingGroups {
  bestFit: Building[];
  decentFit: Building[];
  wildCard: Building[];
}

function hasAirConditioning(building: Building): boolean {
  const level = building.amenities.ac.level;
  return level === ACLevel.Window || level === ACLevel.Central;
}

function hasLaundryOnEachFloor(building: Building): boolean {
  return building.amenities.laundry.location === LaundryLocation.EachFloor;
}

function hasEnSuiteBathroom(building: Building): boolean {
  const types = building.amenities.bathrooms.types;
  return types.includes(BathroomType.SharedSuite) || types.includes(BathroomType.Private);
}

function hasSingleRoom(building: Building): boolean {
  const rooms = building.amenities.roomTypes;
  return (
    rooms.includes(RoomType.TradSingle) ||
    rooms.includes(RoomType.SemiSuiteSingle) ||
    rooms.includes(RoomType.StudioApartmentSingle)
  );
}

function amenityScore(building: Building, filters: FilterState): number {
  let score = 0;
  if (filters.airConditioning && hasAirConditioning(building)) score += 1;
  if (filters.laundryEachFloor && hasLaundryOnEachFloor(building)) score += 1;
  if (filters.enSuiteBathroom && hasEnSuiteBathroom(building)) score += 1;
  if (filters.singleRoom && hasSingleRoom(building)) score += 1;
  if (filters.serviceAnimal && building.accessibility.serviceAnimalFriendly) score += 1;
  if (filters.wheelchairAccessible && building.accessibility.wheelchairAccessible) score += 1;
  if (filters.genderHousing !== null && building.amenities.genderHousing === filters.genderHousing)
    score += 1;
  return score;
}

function preferenceScore(actual: number | undefined, wanted: number | null): number {
  if (actual === undefined || wanted === null) return 0;
  const difference = Math.abs(actual - wanted);
  return Math.max(0, 2 - difference);
}

function atmosphereScore(building: Building, filters: FilterState): number {
  const social = preferenceScore(building.atmosphere.socialness, filters.socialness);
  const noise = preferenceScore(building.atmosphere.noiseLevel, filters.noiseLevel);
  return social + noise;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Straight-line distance between two coordinates (haversine formula).
function metersBetween(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
}

function proximityScore(building: Building, filters: FilterState): number {
  const place = campusBuildings.find((campus) => campus.id === filters.distanceFrom);
  const { latitude, longitude } = building.location;
  if (place === undefined || latitude === undefined || longitude === undefined) return 0;
  const meters = metersBetween(latitude, longitude, place.latitude, place.longitude);
  return PROXIMITY_MAX_SCORE * Math.max(0, 1 - meters / PROXIMITY_RANGE_METERS);
}

export function scoreBuilding(building: Building, filters: FilterState): number {
  return (
    amenityScore(building, filters) +
    atmosphereScore(building, filters) +
    proximityScore(building, filters)
  );
}

function isEligible(building: Building, filters: FilterState): boolean {
  if (filters.genderHousing === null) return true;
  const housing = building.amenities.genderHousing;
  if (housing === GenderHousing.CoEd || housing === GenderHousing.GenderInclusive) return true;
  return housing === filters.genderHousing;
}

export function rankBuildings(buildings: Building[], filters: FilterState): Building[] {
  const eligible = buildings.filter((building) => isEligible(building, filters));
  const scored = eligible.map((building) => ({
    building: building,
    score: scoreBuilding(building, filters),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.building);
}

export function groupBuildings(buildings: Building[], filters: FilterState): BuildingGroups {
  const ranked = rankBuildings(buildings, filters);

  return {
    bestFit: ranked.slice(0, BEST_FIT_COUNT),
    decentFit: ranked.slice(BEST_FIT_COUNT, BEST_FIT_COUNT + DECENT_FIT_COUNT),
    wildCard: ranked.slice(BEST_FIT_COUNT + DECENT_FIT_COUNT),
  };
}
