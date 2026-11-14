import type { paths } from "../api/openapi.d.ts";
import {
  ACLevel,
  type AmenityData,
  BathroomType,
  type Building,
  GenderHousing,
  HousingClass,
  KitchenScope,
  LaundryLocation,
  RoomType,
} from "./buildingTypes";

export type ApiBuilding =
  paths["/api/buildings"]["get"]["responses"]["200"]["content"]["application/json"][number];

const acLevels = Object.values(ACLevel);
const bathroomTypes = Object.values(BathroomType);
const genderHousings = Object.values(GenderHousing);
const housingClasses = Object.values(HousingClass);
const kitchenScopes = Object.values(KitchenScope);
const laundryLocations = Object.values(LaundryLocation);
const roomTypes = Object.values(RoomType);

function isOneOf<T extends string>(allowed: readonly T[], value: unknown): value is T {
  return allowed.some((candidate) => candidate === value);
}

// The API sends enum values as plain strings, so check them against the frontend enums.
function parseEnum<T extends string>(allowed: readonly T[], value: string, label: string): T {
  if (isOneOf(allowed, value)) return value;
  throw new Error(`${label}: unexpected value "${value}"`);
}

function detailsOf(source: { details?: string }): { details?: string } {
  return source.details === undefined ? {} : { details: source.details };
}

function toAmenities(id: string, amenities: ApiBuilding["amenities"]): AmenityData {
  const label = (field: string) => `${id} ${field}`;
  return {
    ac: {
      level: parseEnum(acLevels, amenities.ac.level, label("ac level")),
      ...detailsOf(amenities.ac),
    },
    bathrooms: {
      types: amenities.bathrooms.types.map((type) =>
        parseEnum(bathroomTypes, type, label("bathroom type")),
      ),
      ...detailsOf(amenities.bathrooms),
    },
    commonAreas: amenities.commonAreas,
    genderHousing: parseEnum(genderHousings, amenities.genderHousing, label("gender housing")),
    gym: amenities.gym,
    kitchen: {
      scope: parseEnum(kitchenScopes, amenities.kitchen.scope, label("kitchen scope")),
      ...detailsOf(amenities.kitchen),
    },
    laundry: {
      location: parseEnum(laundryLocations, amenities.laundry.location, label("laundry location")),
      ...detailsOf(amenities.laundry),
    },
    roomTypes: amenities.roomTypes.map((type) => parseEnum(roomTypes, type, label("room type"))),
  };
}

export function toBuilding(api: ApiBuilding): Building {
  return {
    accessibility: api.accessibility,
    amenities: toAmenities(api.id, api.amenities),
    atmosphere: api.atmosphere,
    code: api.code,
    editorialTags: api.editorialTags,
    housingClasses: api.housingClasses.map((housingClass) =>
      parseEnum(housingClasses, housingClass, `${api.id} housing class`),
    ),
    id: api.id,
    location: api.location,
    media: api.media,
    name: api.name,
    reviews: { averages: api.reviews.averages, count: Number(api.reviews.count) },
  };
}
