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
export const roommateStatusEnum = pgEnum("roommate_status", ["searching", "committed", "inactive"]);

// Tables

export const userTable = pgTable("user", {
  andrewId: text("andrew_id"),
  createdTime: timestamp("created_time"),
  id: serial("id").primaryKey(),
  name: text("name"),
  oidcSubject: text("oidc_subject"),
});

// Server-side login sessions, keyed by the opaque token stored in the
// session cookie. Created on a successful OIDC callback, looked up on every
// request to resolve the logged-in user.
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
    .references(() => userTable.id),
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
    .references(() => userTable.id),
  volumePreference: integer("volume_preference"),
  wakeTime: text("wake_time"),
  whereFrom: text("where_from"),
});

export const dormTable = pgTable("dorm", {
  acDetails: text("ac_details"),
  bathroomDetails: text("bathroom_details"),
  bathroomType: text("bathroom_type"),
  closeBuildings: text("close_buildings").array(),
  hasAc: boolean("has_ac"),
  id: serial("id").primaryKey(),
  imageUrl: text("image_url"),
  kitchenDescription: text("kitchen_description"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  loungeDescription: text("lounge_description"),
  name: text("name"),
  photoGallery: json("photo_gallery"),
  roomTypes: text("room_types").array(),
  tags: text("tags").array(),
  updatedAt: timestamp("updated_at"),
});

export const reviewTable = pgTable("review", {
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
  submittedAt: timestamp("submitted_at"),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
});
