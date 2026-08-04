import {
  ACLevel,
  BathroomType,
  type Building,
  type FilterState,
  LaundryLocation,
  RoomType,
} from "./buildingTypes";

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
};

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

function isCloseTo(building: Building, targetId: string, all: Building[]): boolean {
  if (building.location.closeBuildings.includes(targetId)) return true;
  const target = all.find((other) => other.id === targetId);
  if (target === undefined) return false;
  return target.location.closeBuildings.includes(building.id);
}

function proximityScore(building: Building, filters: FilterState, all: Building[]): number {
  if (filters.distanceFrom === "" || filters.distanceFrom === building.id) return 0;
  return isCloseTo(building, filters.distanceFrom, all) ? 2 : 0;
}

export function scoreBuilding(building: Building, filters: FilterState, all: Building[]): number {
  return (
    amenityScore(building, filters) +
    atmosphereScore(building, filters) +
    proximityScore(building, filters, all)
  );
}

export function groupBuildings(buildings: Building[], filters: FilterState): BuildingGroups {
  const scored = buildings.map((building) => ({
    building: building,
    score: scoreBuilding(building, filters, buildings),
  }));
  scored.sort((a, b) => b.score - a.score);
  const ranked = scored.map((entry) => entry.building);

  return {
    bestFit: ranked.slice(0, 3),
    decentFit: ranked.slice(3, 6),
    wildCard: ranked.slice(6, 9),
  };
}
