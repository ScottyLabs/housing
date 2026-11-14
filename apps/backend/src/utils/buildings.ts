// Reshapes database rows into the nested building shape the frontend works with, so they can be tested without a database.
import type { CampusBuilding, Dorm } from "../db/schema.ts";

export interface BuildingReviews {
  averages: {
    amenities: number | null;
    noise: number | null;
    overall: number | null;
    roomQuality: number | null;
    socialLife: number | null;
  };
  count: number;
}

function withDetails(details: string | null): { details?: string } {
  return details === null ? {} : { details };
}

function toAmenities(dorm: Dorm) {
  return {
    ac: { level: dorm.acLevel, ...withDetails(dorm.acDetails) },
    bathrooms: { types: dorm.bathroomTypes, ...withDetails(dorm.bathroomDetails) },
    commonAreas: { hasLounge: dorm.hasLounge, ...withDetails(dorm.loungeDescription) },
    genderHousing: dorm.genderHousing,
    gym: { available: dorm.gymAvailable, ...withDetails(dorm.gymDetails) },
    kitchen: { scope: dorm.kitchenScope, ...withDetails(dorm.kitchenDescription) },
    laundry: { location: dorm.laundryLocation, ...withDetails(dorm.laundryDetails) },
    roomTypes: dorm.roomTypes,
  };
}

function toAtmosphere(dorm: Dorm, reviews: BuildingReviews) {
  const atmosphere: { noiseLevel?: number; socialness?: number } = {};
  const noiseLevel = reviews.averages.noise ?? dorm.noiseLevel;
  const socialness = reviews.averages.socialLife ?? dorm.socialness;
  if (noiseLevel !== null) atmosphere.noiseLevel = noiseLevel;
  if (socialness !== null) atmosphere.socialness = socialness;
  return atmosphere;
}

function toLocation(dorm: Dorm) {
  const location: {
    closeBuildings: string[];
    latitude?: number;
    longitude?: number;
    note?: string;
  } = { closeBuildings: dorm.closeBuildings ?? [] };
  if (dorm.latitude !== null) location.latitude = dorm.latitude;
  if (dorm.longitude !== null) location.longitude = dorm.longitude;
  if (dorm.locationNote !== null) location.note = dorm.locationNote;
  return location;
}

export function toBuilding(dorm: Dorm, reviews: BuildingReviews) {
  return {
    accessibility: {
      groundFloorRooms: dorm.groundFloorRooms,
      serviceAnimalFriendly: dorm.serviceAnimalFriendly,
      strobeAlarm: dorm.strobeAlarm,
      wheelchairAccessible: dorm.wheelchairAccessible,
    },
    amenities: toAmenities(dorm),
    atmosphere: toAtmosphere(dorm, reviews),
    code: dorm.code,
    editorialTags: dorm.tags ?? [],
    housingClasses: dorm.housingClasses,
    id: dorm.slug,
    location: toLocation(dorm),
    media: {
      floorPlans: dorm.floorPlans,
      mainImage: dorm.imageUrl ?? "",
      photos: dorm.photoGallery ?? [],
    },
    name: dorm.name,
    reviews,
  };
}

export function toCampusBuilding(campus: CampusBuilding) {
  const building: {
    code: string;
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    subtitle?: string;
  } = {
    code: campus.code,
    id: campus.slug,
    latitude: campus.latitude,
    longitude: campus.longitude,
    name: campus.name,
  };
  if (campus.subtitle !== null) building.subtitle = campus.subtitle;
  return building;
}
