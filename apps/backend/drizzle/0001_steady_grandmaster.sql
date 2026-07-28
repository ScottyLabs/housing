CREATE TYPE "public"."roommate_status" AS ENUM('searching', 'committed', 'inactive');--> statement-breakpoint
CREATE TABLE "dorm" (
	"ac_details" text,
	"bathroom_details" text,
	"bathroom_type" text,
	"close_buildings" text[],
	"has_ac" boolean,
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text,
	"kitchen_description" text,
	"latitude" numeric,
	"longitude" numeric,
	"lounge_description" text,
	"name" text,
	"photo_gallery" json,
	"room_types" text[],
	"tags" text[],
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "review" (
	"body" text,
	"dorm_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"lived_term" text,
	"lived_year" text,
	"rating_amenities" integer,
	"rating_atmosphere" integer,
	"rating_overall" integer,
	"rating_room_quality" integer,
	"submitted_at" timestamp,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roommate_profile" (
	"alcohol" boolean,
	"assigned_sex" text,
	"bathroom_preference" text,
	"committed" boolean,
	"drugs" boolean,
	"extras" json,
	"id" serial PRIMARY KEY NOT NULL,
	"intended_major" text,
	"is_visible" boolean,
	"morning_prep_time" text,
	"neatness" integer,
	"party_frequency" integer,
	"preferred_roommate_school" text,
	"preferred_shower_time" text,
	"pronouns" text,
	"school" text,
	"sleep_time" text,
	"snores" boolean,
	"social_energy" integer,
	"status" "roommate_status",
	"updated_at" timestamp,
	"user_id" integer NOT NULL,
	"volume_preference" integer,
	"wake_time" text,
	"where_from" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"accommodations" text[],
	"cooking_frequency" integer,
	"goals" text[],
	"gym_frequency" integer,
	"id" serial PRIMARY KEY NOT NULL,
	"major" text,
	"needs_alone_time" integer,
	"preferred_amenities" text[],
	"preferred_gender_housing" text,
	"productive_around_others" integer,
	"social_frequency" integer,
	"updated_at" timestamp,
	"user_id" integer NOT NULL,
	"year" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"andrew_id" text,
	"created_time" timestamp,
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"oidc_subject" text
);
--> statement-breakpoint
DROP TABLE "placeholder" CASCADE;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_dorm_id_dorm_id_fk" FOREIGN KEY ("dorm_id") REFERENCES "public"."dorm"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roommate_profile" ADD CONSTRAINT "roommate_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;