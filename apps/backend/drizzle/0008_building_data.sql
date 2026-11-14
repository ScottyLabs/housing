CREATE TYPE "public"."housing_class" AS ENUM('first_year', 'upperclass');--> statement-breakpoint
CREATE TABLE "campus_building" (
	"code" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"subtitle" text,
	CONSTRAINT "campus_building_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "code" text;--> statement-breakpoint
ALTER TABLE "dorm" ADD COLUMN "housing_classes" "housing_class"[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
UPDATE "dorm" SET "code" = "backfill"."code", "housing_classes" = "backfill"."housing_classes" FROM (VALUES
  ('etower', 'MOE', '{first_year}'::"housing_class"[]),
  ('stever', 'STE', '{first_year}'::"housing_class"[]),
  ('boss', 'BOS', '{first_year}'::"housing_class"[]),
  ('clyde', 'CLY', '{first_year}'::"housing_class"[]),
  ('donner', 'DON', '{first_year}'::"housing_class"[]),
  ('henderson', 'HEN', '{first_year}'::"housing_class"[]),
  ('mcgill', 'MCG', '{first_year}'::"housing_class"[]),
  ('morewood', 'MOR', '{first_year,upperclass}'::"housing_class"[]),
  ('mudge', 'MUD', '{first_year}'::"housing_class"[]),
  ('fifth', 'ROF', '{first_year}'::"housing_class"[]),
  ('scobell', 'SCO', '{first_year}'::"housing_class"[]),
  ('welch', 'WEL', '{first_year}'::"housing_class"[]),
  ('hamerschlag', 'HAM', '{first_year}'::"housing_class"[]),
  ('maggiemo', 'MAG', '{first_year}'::"housing_class"[]),
  ('fairfax', 'FAF', '{upperclass}'::"housing_class"[]),
  ('fifthneville', 'FIF', '{upperclass}'::"housing_class"[]),
  ('forbesbeeler', 'FBA', '{upperclass}'::"housing_class"[]),
  ('highlands', 'HIL', '{upperclass}'::"housing_class"[]),
  ('margaretmorrison', 'MMA', '{upperclass}'::"housing_class"[]),
  ('neville', 'NVL', '{upperclass}'::"housing_class"[]),
  ('roselawn', 'ROS', '{upperclass}'::"housing_class"[]),
  ('woodlawn', 'WOC', '{upperclass}'::"housing_class"[]),
  ('resnik', 'RES', '{upperclass}'::"housing_class"[]),
  ('spirit', 'SPI', '{upperclass}'::"housing_class"[]),
  ('westwing', 'WWG', '{upperclass}'::"housing_class"[]),
  ('fifthclyde', 'FCL', '{upperclass}'::"housing_class"[])
) AS "backfill" ("slug", "code", "housing_classes") WHERE "dorm"."slug" = "backfill"."slug";--> statement-breakpoint
UPDATE "dorm" SET "code" = upper(left("slug", 3)) WHERE "code" IS NULL;--> statement-breakpoint
ALTER TABLE "dorm" ALTER COLUMN "code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "dorm" ALTER COLUMN "housing_classes" DROP DEFAULT;--> statement-breakpoint
INSERT INTO "campus_building" ("slug", "code", "name", "subtitle", "latitude", "longitude") VALUES
  ('407-s-craig', '4SC', '407 S Craig Street', 'Administration', 40.444988, -79.948421),
  ('alumni-house', 'AH', 'Alumni House', 'Administration', 40.444485, -79.941662),
  ('ansys-hall', 'ANS', 'ANSYS Hall', NULL, 40.441951, -79.946588),
  ('baker-hall', 'BH', 'Baker Hall', NULL, 40.44151, -79.945096),
  ('cohon-center', 'CUC', 'Cohon University Center', 'University Center', 40.44354, -79.941964),
  ('college-of-fine-arts', 'CFA', 'College of Fine Arts', 'College of Fine Arts', 40.441448, -79.942951),
  ('cyert-hall', 'CYH', 'Cyert Hall', NULL, 40.444234, -79.943959),
  ('doherty-hall', 'DH', 'Doherty Hall', NULL, 40.44251, -79.944608),
  ('edsh', 'EDS', 'Elliott Dunlap Smith Hall', 'Academic', 40.443966, -79.945535),
  ('gates-hillman', 'GHC', 'Gates and Hillman Centers', 'Computer Science', 40.443495, -79.944572),
  ('gatf', 'GATF', 'GATF Building', 'Research and administration', 40.444732, -79.947807),
  ('gymnasium', 'GYM', 'Gymnasium', 'Athletics', 40.440975, -79.941359),
  ('hamburg-hall', 'HBH', 'Hamburg Hall', 'Heinz College', 40.444177, -79.945551),
  ('hamerschlag-hall', 'HH', 'Hamerschlag Hall', NULL, 40.442423, -79.946671),
  ('hunt-library', 'HL', 'Hunt Library', 'Library', 40.441111, -79.94374),
  ('information-networking-institute', 'INI', 'Information Networking Institute', NULL, 40.446058, -79.948022),
  ('margaret-morrison-hall', 'MM', 'Margaret Morrison Carnegie Hall', 'Design and Architecture', 40.442286, -79.941562),
  ('mellon-institute', 'MI', 'Mellon Institute', NULL, 40.446088, -79.951057),
  ('newell-simon-hall', 'NSH', 'Newell-Simon Hall', NULL, 40.443392, -79.945596),
  ('planetary-robotics', 'PRB', 'Planetary Robotics Building', 'Research', 40.444465, -79.945786),
  ('porter-hall', 'PH', 'Porter Hall', NULL, 40.441729, -79.946236),
  ('posner-hall', 'POS', 'Posner Hall', NULL, 40.441349, -79.942122),
  ('purnell-center', 'PCA', 'Purnell Center for the Arts', NULL, 40.443525, -79.943565),
  ('resnik', 'RES', 'Resnik House', NULL, 40.442521, -79.940027),
  ('roberts-hall', 'REH', 'Roberts Engineering Hall', NULL, 40.442436, -79.947197),
  ('scaife-hall', 'SH', 'Scaife Hall', NULL, 40.441685, -79.947521),
  ('software-engineering-institute', 'SEI', 'Software Engineering Institute', NULL, 40.446317, -79.950279),
  ('tepper-quad', 'TEP', 'Tepper Quad', 'Tepper School of Business', 40.445165, -79.945266),
  ('utdc', 'UT', 'University Technology Development Center', 'Administration and rental', 40.446043, -79.949572),
  ('warner-hall', 'WH', 'Warner Hall', NULL, 40.444231, -79.943372),
  ('wean-hall', 'WEH', 'Wean Hall', NULL, 40.442662, -79.945687),
  ('whitfield-hall', 'WF', 'Whitfield Hall', 'Administration', 40.448412, -79.950191)
ON CONFLICT ("slug") DO NOTHING;
