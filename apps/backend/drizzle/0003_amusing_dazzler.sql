ALTER TABLE "review" ADD CONSTRAINT "review_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "roommate_profile" ADD CONSTRAINT "roommate_profile_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id");