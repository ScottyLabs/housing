ALTER TABLE "user_preferences" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
UPDATE "user_preferences" SET "completed_at" = COALESCE("updated_at", now());