ALTER TABLE "user" ALTER COLUMN "andrew_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_time" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "oidc_subject" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_oidc_subject_unique" UNIQUE("oidc_subject");