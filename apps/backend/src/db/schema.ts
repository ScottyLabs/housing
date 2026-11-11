// NOTE: When someone does implement this, please refer to https://elysiajs.com/integrations/drizzle to properly integrate with ElysiaJS
import {
  boolean,
  integer,
  json,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

// Enums
export const roommateStatusEnum = pgEnum("roommate_status", ["searching", "committed", "inactive"]);

// Building enums. Keep the values in sync with the string enums in apps/frontend/src/data/buildingTypes.ts.
export const roomTypeEnum = pgEnum("room_type", [
  "trad_single",
  "trad_double",
  "trad_triple",
  "semi_suite_single",
  "semi_suite_double",
  "semi_suite_triple",
  "semi_suite_quad",
  "apartment_triple",
  "studio_apartment_single",
  "studio_apartment_double",
]);
export const bathroomTypeEnum = pgEnum("bathroom_type", ["communal", "shared_suite", "private"]);
export const acLevelEnum = pgEnum("ac_level", ["none", "by_necessity", "window", "central"]);
export const laundryLocationEnum = pgEnum("laundry_location", [
  "none",
  "basement",
  "each_floor",
  "in_unit",
]);
export const kitchenScopeEnum = pgEnum("kitchen_scope", ["none", "shared", "in_unit"]);
export const genderHousingEnum = pgEnum("gender_housing", [
  "co_ed",
  "women_only",
  "men_only",
  "gender_inclusive",
]);

export type RoomType = (typeof roomTypeEnum.enumValues)[number];
export type BathroomType = (typeof bathroomTypeEnum.enumValues)[number];
export type ACLevel = (typeof acLevelEnum.enumValues)[number];
export type LaundryLocation = (typeof laundryLocationEnum.enumValues)[number];
export type KitchenScope = (typeof kitchenScopeEnum.enumValues)[number];
export type GenderHousing = (typeof genderHousingEnum.enumValues)[number];

// JSON column shapes. These mirror GalleryImage and FloorPlan in apps/frontend/src/data/buildingTypes.ts
export interface GalleryImage {
  link: string;
  description: string;
}
export interface FloorPlan {
  link: string;
  description: string;
  category: "roomType" | "floor";
  virtualTourLink?: string;
}

// Tables

export const userTable = pgTable("user", {
  andrewId: text("andrew_id").notNull(),
  createdTime: timestamp("created_time").notNull().defaultNow(),
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  oidcSubject: text("oidc_subject").notNull().unique(),
});

export const sessionTable = pgTable("session", {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const userPreferencesTable = pgTable("user_preferences", {
  accommodations: text("accommodations").array(),
  cookingFrequency: integer("cooking_frequency"),
  goals: text("goals").array(),
  gymFrequency: integer("gym_frequency"),
  id: serial("id").primaryKey(),
  major: text("major"),
  needsAloneTime: integer("needs_alone_time"),
  preferredAmenities: text("preferred_amenities").array(),
  preferredGenderHousing: text("preferred_gender_housing"),
  productiveAroundOthers: integer("productive_around_others"),
  socialFrequency: integer("social_frequency"),
  updatedAt: timestamp("updated_at"),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id)
    .unique(),
  year: text("year"),
});

export const roommateProfileTable = pgTable("roommate_profile", {
  alcohol: boolean("alcohol"),
  assignedSex: text("assigned_sex"),
  bathroomPreference: text("bathroom_preference"),
  committed: boolean("committed"),
  drugs: boolean("drugs"),
  extras: json("extras"),
  id: serial("id").primaryKey(),
  intendedMajor: text("intended_major"),
  isVisible: boolean("is_visible"),
  morningPrepTime: text("morning_prep_time"),
  neatness: integer("neatness"),
  partyFrequency: integer("party_frequency"),
  preferredRoommateSchool: text("preferred_roommate_school"),
  preferredShowerTime: text("preferred_shower_time"),
  pronouns: text("pronouns"),
  school: text("school"),
  sleepTime: text("sleep_time"),
  snores: boolean("snores"),
  socialEnergy: integer("social_energy"),
  status: roommateStatusEnum("status"),
  updatedAt: timestamp("updated_at"),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id)
    .unique(),
  volumePreference: integer("volume_preference"),
  wakeTime: text("wake_time"),
  whereFrom: text("where_from"),
});

export const dormTable = pgTable("dorm", {
  acDetails: text("ac_details"),
  acLevel: acLevelEnum("ac_level").notNull(),
  bathroomDetails: text("bathroom_details"),
  bathroomTypes: bathroomTypeEnum("bathroom_types").array().notNull(),
  closeBuildings: text("close_buildings").array(),
  floorPlans: json("floor_plans").$type<FloorPlan[]>().notNull().default([]),
  genderHousing: genderHousingEnum("gender_housing").notNull(),
  groundFloorRooms: boolean("ground_floor_rooms").notNull(),
  gymAvailable: boolean("gym_available").notNull(),
  gymDetails: text("gym_details"),
  hasLounge: boolean("has_lounge").notNull(),
  id: serial("id").primaryKey(),
  imageUrl: text("image_url"),
  kitchenDescription: text("kitchen_description"),
  kitchenScope: kitchenScopeEnum("kitchen_scope").notNull(),
  latitude: numeric("latitude", { mode: "number" }),
  laundryDetails: text("laundry_details"),
  laundryLocation: laundryLocationEnum("laundry_location").notNull(),
  locationNote: text("location_note"),
  longitude: numeric("longitude", { mode: "number" }),
  loungeDescription: text("lounge_description"),
  name: text("name").notNull(),
  noiseLevel: integer("noise_level"),
  photoGallery: json("photo_gallery").$type<GalleryImage[]>(),
  roomTypes: roomTypeEnum("room_types").array().notNull(),
  serviceAnimalFriendly: boolean("service_animal_friendly").notNull(),
  // Stable URL-safe identifier (e.g. "etower"). The frontend routes on this, not on the integer id.
  slug: text("slug").notNull().unique(),
  socialness: integer("socialness"),
  strobeAlarm: boolean("strobe_alarm").notNull(),
  tags: text("tags").array(),
  updatedAt: timestamp("updated_at"),
  wheelchairAccessible: boolean("wheelchair_accessible").notNull(),
});

export type Dorm = typeof dormTable.$inferSelect;
export type NewDorm = typeof dormTable.$inferInsert;

export const reviewTable = pgTable(
  "review",
  {
    body: text("body"),
    dormId: integer("dorm_id")
      .notNull()
      .references(() => dormTable.id),
    id: serial("id").primaryKey(),
    livedTerm: text("lived_term"),
    livedYear: text("lived_year"),
    ratingAmenities: integer("rating_amenities"),
    ratingAtmosphere: integer("rating_atmosphere"),
    ratingOverall: integer("rating_overall"),
    ratingRoomQuality: integer("rating_room_quality"),
    submittedAt: timestamp("submitted_at").defaultNow(),
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id),
  },
  (table) => [unique("review_user_dorm_unique").on(table.userId, table.dormId)],
);
