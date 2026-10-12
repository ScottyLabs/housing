ALTER TABLE "review" DROP CONSTRAINT "review_user_id_unique";--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_dorm_unique" UNIQUE("user_id","dorm_id");