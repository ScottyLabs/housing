CREATE TYPE "public"."ac_level" AS ENUM('none', 'by_necessity', 'window', 'central');--> statement-breakpoint
CREATE TYPE "public"."bathroom_type" AS ENUM('communal', 'shared_suite', 'private');--> statement-breakpoint
CREATE TYPE "public"."gender_housing" AS ENUM('co_ed', 'women_only', 'men_only', 'gender_inclusive');--> statement-breakpoint
CREATE TYPE "public"."kitchen_scope" AS ENUM('none', 'shared', 'in_unit');--> statement-breakpoint
CREATE TYPE "public"."laundry_location" AS ENUM('none', 'basement', 'each_floor', 'in_unit');--> statement-breakpoint
CREATE TYPE "public"."room_type" AS ENUM('trad_single', 'trad_double', 'trad_triple', 'semi_suite_single', 'semi_suite_double', 'semi_suite_triple', 'semi_suite_quad', 'apartment_triple', 'studio_apartment_single', 'studio_apartment_double');--> statement-breakpoint
ALTER TABLE "dorm" ALTER COLUMN "room_types" SET DATA TYPE "public"."room_type"[] USING "room_types"::text[]::"public"."room_type"[];--> statement-breakpoint
ALTER TABLE "dorm" ALTER COLUMN "room_types" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "ac_level" "ac_level" NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "bathroom_types" "bathroom_type"[] NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "floor_plans" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "gender_housing" "gender_housing" NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "ground_floor_rooms" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "gym_available" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "gym_details" text;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "has_lounge" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "kitchen_scope" "kitchen_scope" NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "laundry_details" text;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "laundry_location" "laundry_location" NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "location_note" text;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "noise_level" integer;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "service_animal_friendly" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "socialness" integer;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "strobe_alarm" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "wheelchair_accessible" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" DROP COLUMN "bathroom_type";--> statement-breakpoint
ALTER TABLE "dorm" DROP COLUMN "has_ac";--> statement-breakpoint
ALTER TABLE "dorm" ADD CONSTRAINT "dorm_slug_unique" UNIQUE("slug");
