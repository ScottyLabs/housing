// Response schemas for the building routes. They mirror the Building and CampusBuilding types in apps/frontend/src/data/buildingTypes.ts.
import { t } from "elysia";
import {
  acLevelEnum,
  bathroomTypeEnum,
  genderHousingEnum,
  housingClassEnum,
  kitchenScopeEnum,
  laundryLocationEnum,
  roomTypeEnum,
} from "../db/schema.ts";
import { ratingSummary } from "./review-shared.ts";

const details = t.Optional(t.String());

const galleryImage = t.Object({ description: t.String(), link: t.String() });

const floorPlan = t.Object({
  category: t.UnionEnum(["roomType", "floor"]),
  description: t.String(),
  link: t.String(),
  virtualTourLink: t.Optional(t.String()),
});

const amenities = t.Object({
  ac: t.Object({ details, level: t.UnionEnum([...acLevelEnum.enumValues]) }),
  bathrooms: t.Object({
    details,
    types: t.Array(t.UnionEnum([...bathroomTypeEnum.enumValues])),
  }),
  commonAreas: t.Object({ details, hasLounge: t.Boolean() }),
  genderHousing: t.UnionEnum([...genderHousingEnum.enumValues]),
  gym: t.Object({ available: t.Boolean(), details }),
  kitchen: t.Object({ details, scope: t.UnionEnum([...kitchenScopeEnum.enumValues]) }),
  laundry: t.Object({ details, location: t.UnionEnum([...laundryLocationEnum.enumValues]) }),
  roomTypes: t.Array(t.UnionEnum([...roomTypeEnum.enumValues])),
});

const accessibility = t.Object({
  groundFloorRooms: t.Boolean(),
  serviceAnimalFriendly: t.Boolean(),
  strobeAlarm: t.Boolean(),
  wheelchairAccessible: t.Boolean(),
});

const location = t.Object({
  closeBuildings: t.Array(t.String()),
  latitude: t.Optional(t.Number()),
  longitude: t.Optional(t.Number()),
  note: t.Optional(t.String()),
});

export const buildingSchema = t.Object({
  accessibility,
  amenities,
  atmosphere: t.Object({
    noiseLevel: t.Optional(t.Number()),
    socialness: t.Optional(t.Number()),
  }),
  code: t.String(),
  editorialTags: t.Array(t.String()),
  housingClasses: t.Array(t.UnionEnum([...housingClassEnum.enumValues])),
  id: t.String(),
  location,
  media: t.Object({
    floorPlans: t.Array(floorPlan),
    mainImage: t.String(),
    photos: t.Array(galleryImage),
  }),
  name: t.String(),
  reviews: ratingSummary,
});

export const campusBuildingSchema = t.Object({
  code: t.String(),
  id: t.String(),
  latitude: t.Number(),
  longitude: t.Number(),
  name: t.String(),
  subtitle: t.Optional(t.String()),
});
