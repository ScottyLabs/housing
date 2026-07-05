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
} from "drizzle-orm/pg-core";

// Enums

// TODO: Replace placeholder values with the real status options
export const roommateStatusEnum = pgEnum("roommate_status", [
  "searching",
  "committed",
  "inactive",
]);

// Tables

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name"),
  andrewId: text("andrew_id"),
  oidcSubject: text("oidc_subject"),
  createdTime: timestamp("created_time"),
});


export const userPreferencesTable = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => userTable.id),
  preferredGenderHousing: text("preferred_gender_housing"),
  year: text("year"),
  major: text("major"),
  cookingFrequency: integer("cooking_frequency"),               // 1–5
  gymFrequency: integer("gym_frequency"),                       // 1–5
  productiveAroundOthers: integer("productive_around_others"),  // 1–5
  needsAloneTime: integer("needs_alone_time"),                  // 1–5
  socialFrequency: integer("social_frequency"),                 // 1–5
  goals: text("goals").array(),
  accommodations: text("accommodations").array(),
  preferredAmenities: text("preferred_amenities").array(),
  updatedAt: timestamp("updated_at"),
});

export const roommateProfileTable = pgTable("roommate_profile", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => userTable.id),
  isVisible: boolean("is_visible"),
  status: roommateStatusEnum("status"),
  committed: boolean("committed"),
  whereFrom: text("where_from"),
  school: text("school"),
  intendedMajor: text("intended_major"),
  preferredRoommateSchool: text("preferred_roommate_school"),
  assignedSex: text("assigned_sex"),
  pronouns: text("pronouns"),
  bathroomPreference: text("bathroom_preference"),
  wakeTime: text("wake_time"),
  sleepTime: text("sleep_time"),
  snores: boolean("snores"),
  morningPrepTime: text("morning_prep_time"),
  preferredShowerTime: text("preferred_shower_time"),
  neatness: integer("neatness"),                    // 1–5
  volumePreference: integer("volume_preference"),   // 1–5
  socialEnergy: integer("social_energy"),           // 1–5
  partyFrequency: integer("party_frequency"),       // 1–5
  alcohol: boolean("alcohol"),
  drugs: boolean("drugs"),
  extras: json("extras"),
  updatedAt: timestamp("updated_at"),
});

export const dormTable = pgTable("dorm", {
  id: serial("id").primaryKey(),
  name: text("name"),
  imageUrl: text("image_url"),
  closeBuildings: text("close_buildings").array(),
  hasAc: boolean("has_ac"),
  acDetails: text("ac_details"),
  kitchenDescription: text("kitchen_description"),
  loungeDescription: text("lounge_description"),
  bathroomType: text("bathroom_type"),
  bathroomDetails: text("bathroom_details"),
  roomTypes: text("room_types").array(),
  tags: text("tags").array(),
  photoGallery: json("photo_gallery"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  updatedAt: timestamp("updated_at"),
});

export const reviewTable = pgTable("review", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => userTable.id),
  dormId: integer("dorm_id").notNull().references(() => dormTable.id),
  body: text("body"),
  ratingOverall: integer("rating_overall"),           // 1–5
  ratingAmenities: integer("rating_amenities"),       // 1–5
  ratingRoomQuality: integer("rating_room_quality"),  // 1–5
  ratingAtmosphere: integer("rating_atmosphere"),     // 1–5
  livedYear: text("lived_year"),
  livedTerm: text("lived_term"),
  submittedAt: timestamp("submitted_at"),
});
