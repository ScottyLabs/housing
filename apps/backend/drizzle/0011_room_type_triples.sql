-- Rebuilt instead of ADD VALUE: a new enum value cannot be used by a later migration in the same transaction.
ALTER TYPE "public"."room_type" RENAME TO "room_type_old";--> statement-breakpoint
CREATE TYPE "public"."room_type" AS ENUM('trad_single', 'trad_double', 'trad_triple', 'semi_suite_single', 'semi_suite_double', 'semi_suite_triple', 'semi_suite_double_as_triple', 'semi_suite_quad', 'apartment_triple', 'studio_apartment_single', 'studio_apartment_double', 'studio_apartment_triple');--> statement-breakpoint
ALTER TABLE "dorm" ALTER COLUMN "room_types" SET DATA TYPE "public"."room_type"[] USING "room_types"::text[]::"public"."room_type"[];--> statement-breakpoint
DROP TYPE "public"."room_type_old";
