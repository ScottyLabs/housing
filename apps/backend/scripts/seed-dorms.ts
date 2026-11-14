/// <reference lib="deno.ns" />

// Seeds the `dorm` and `campus_building` tables from apps/frontend/src/data/buildings.json and campusBuildings.json.
//
// Safe to re-run: rows are upserted on `slug`, so existing rows are updated in place.
// Dorms keep their integer `id`, which reviews reference. Rows no longer in the JSON files are left alone.
//
// Usage (from apps/backend, after `deno task db:migrate`): deno task db:seed

import { getTableColumns, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { createSqlClient } from "../src/db/client.ts";
import {
  acLevelEnum,
  bathroomTypeEnum,
  campusBuildingTable,
  dormTable,
  type FloorPlan,
  genderHousingEnum,
  type GalleryImage,
  housingClassEnum,
  kitchenScopeEnum,
  laundryLocationEnum,
  type NewCampusBuilding,
  type NewDorm,
  roomTypeEnum,
} from "../src/db/schema.ts";
import { configureLogger, logger, nodeError } from "../src/utils/log.ts";

// Read via a relative URL rather than importing it, so the backend has no dependency on the frontend app.
const buildingsUrl = new URL("../../frontend/src/data/buildings.json", import.meta.url);
const campusBuildingsUrl = new URL("../../frontend/src/data/campusBuildings.json", import.meta.url);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

// Shape of one entry in buildings.json (the frontend `Building` type, with enums as plain strings).
interface BuildingJson {
  accessibility: {
    groundFloorRooms: boolean;
    serviceAnimalFriendly: boolean;
    strobeAlarm: boolean;
    wheelchairAccessible: boolean;
  };
  amenities: {
    ac: { details?: string; level: string };
    bathrooms: { details?: string; types: string[] };
    commonAreas: { details?: string; hasLounge: boolean };
    genderHousing: string;
    gym: { available: boolean; details?: string };
    kitchen: { details?: string; scope: string };
    laundry: { details?: string; location: string };
    roomTypes: string[];
  };
  atmosphere: { noiseLevel?: number; socialness?: number };
  code: string;
  editorialTags?: string[];
  housingClasses: string[];
  id: string;
  location: {
    closeBuildings: string[];
    latitude?: number;
    longitude?: number;
    note?: string;
  };
  media: { floorPlans: FloorPlan[]; mainImage: string; photos: GalleryImage[] };
  name: string;
}

// Shape of one entry in campusBuildings.json.
interface CampusBuildingJson {
  code: string;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  subtitle?: string;
}

function isOneOf<T extends string>(allowed: readonly T[], value: unknown): value is T {
  return allowed.some((candidate) => candidate === value);
}

// The database enums and the frontend enums are separate definitions, so fail loudly if they drift.
// `label` says where the value came from, e.g. "etower amenities.ac.level".
function parseEnum<T extends string>(allowed: readonly T[], value: unknown, label: string): T {
  if (isOneOf(allowed, value)) {
    return value;
  }
  throw new Error(
    `${label}: invalid value ${JSON.stringify(value)} (expected one of: ${allowed.join(", ")})`,
  );
}

function parseOptionalInteger(value: number | undefined, label: string): number | null {
  if (value === undefined) {
    return null;
  }
  if (!Number.isInteger(value)) {
    throw new TypeError(`${label}: must be an integer, got ${value}`);
  }
  return value;
}

function assertValidSlugs(buildings: Array<{ id: string }>, file: string): Set<string> {
  const slugs = new Set<string>();
  for (const { id } of buildings) {
    if (!SLUG_PATTERN.test(id)) {
      throw new Error(`"${id}" is not a valid slug (lowercase letters, digits and dashes)`);
    }
    if (slugs.has(id)) {
      throw new Error(`Duplicate slug "${id}" in ${file}`);
    }
    slugs.add(id);
  }
  return slugs;
}

async function readCampusBuildings(): Promise<CampusBuildingJson[]> {
  const parsed: unknown = JSON.parse(await Deno.readTextFile(campusBuildingsUrl));
  if (!Array.isArray(parsed)) {
    throw new TypeError("campusBuildings.json must contain an array of campus buildings");
  }
  const campusBuildings = parsed as CampusBuildingJson[];
  assertValidSlugs(campusBuildings, "campusBuildings.json");
  return campusBuildings;
}

function assertCloseBuildingsExist(buildings: BuildingJson[], campusIds: Set<string>): void {
  for (const building of buildings) {
    for (const other of building.location.closeBuildings) {
      if (!campusIds.has(other)) {
        throw new Error(
          `${building.id}: closeBuildings references unknown campus building "${other}"`,
        );
      }
    }
  }
}

// closeBuildings holds ids of academic/non-residential campus buildings, not of other dorms.
async function readBuildings(campusBuildings: CampusBuildingJson[]): Promise<BuildingJson[]> {
  const parsed: unknown = JSON.parse(await Deno.readTextFile(buildingsUrl));
  if (!Array.isArray(parsed)) {
    throw new TypeError("buildings.json must contain an array of buildings");
  }
  const buildings = parsed as BuildingJson[];
  assertValidSlugs(buildings, "buildings.json");
  assertCloseBuildingsExist(buildings, new Set(campusBuildings.map((campus) => campus.id)));
  return buildings;
}

function accessibilityColumns({ accessibility }: BuildingJson) {
  return {
    groundFloorRooms: accessibility.groundFloorRooms,
    serviceAnimalFriendly: accessibility.serviceAnimalFriendly,
    strobeAlarm: accessibility.strobeAlarm,
    wheelchairAccessible: accessibility.wheelchairAccessible,
  };
}

function atmosphereColumns({ atmosphere, id }: BuildingJson) {
  return {
    noiseLevel: parseOptionalInteger(atmosphere.noiseLevel, `${id} atmosphere.noiseLevel`),
    socialness: parseOptionalInteger(atmosphere.socialness, `${id} atmosphere.socialness`),
  };
}

function locationColumns({ location }: BuildingJson) {
  return {
    closeBuildings: location.closeBuildings,
    latitude: location.latitude ?? null,
    locationNote: location.note ?? null,
    longitude: location.longitude ?? null,
  };
}

function mediaColumns({ media }: BuildingJson) {
  return {
    floorPlans: media.floorPlans,
    imageUrl: media.mainImage,
    photoGallery: media.photos,
  };
}

// Room, bathroom, kitchen and lounge columns.
function spaceColumns({ amenities, id }: BuildingJson) {
  return {
    bathroomDetails: amenities.bathrooms.details ?? null,
    bathroomTypes: amenities.bathrooms.types.map((type) =>
      parseEnum(bathroomTypeEnum.enumValues, type, `${id} amenities.bathrooms.types`),
    ),
    hasLounge: amenities.commonAreas.hasLounge,
    kitchenDescription: amenities.kitchen.details ?? null,
    kitchenScope: parseEnum(
      kitchenScopeEnum.enumValues,
      amenities.kitchen.scope,
      `${id} amenities.kitchen.scope`,
    ),
    loungeDescription: amenities.commonAreas.details ?? null,
    roomTypes: amenities.roomTypes.map((type) =>
      parseEnum(roomTypeEnum.enumValues, type, `${id} amenities.roomTypes`),
    ),
  };
}

// AC, laundry, gym and gender housing columns.
function serviceColumns({ amenities, id }: BuildingJson) {
  return {
    acDetails: amenities.ac.details ?? null,
    acLevel: parseEnum(acLevelEnum.enumValues, amenities.ac.level, `${id} amenities.ac.level`),
    genderHousing: parseEnum(
      genderHousingEnum.enumValues,
      amenities.genderHousing,
      `${id} amenities.genderHousing`,
    ),
    gymAvailable: amenities.gym.available,
    gymDetails: amenities.gym.details ?? null,
    laundryDetails: amenities.laundry.details ?? null,
    laundryLocation: parseEnum(
      laundryLocationEnum.enumValues,
      amenities.laundry.location,
      `${id} amenities.laundry.location`,
    ),
  };
}

function toDorm(building: BuildingJson, updatedAt: Date): NewDorm {
  return {
    ...accessibilityColumns(building),
    ...atmosphereColumns(building),
    ...locationColumns(building),
    ...mediaColumns(building),
    ...serviceColumns(building),
    ...spaceColumns(building),
    code: building.code,
    housingClasses: building.housingClasses.map((housingClass) =>
      parseEnum(housingClassEnum.enumValues, housingClass, `${building.id} housingClasses`),
    ),
    name: building.name,
    slug: building.id,
    tags: building.editorialTags ?? [],
    updatedAt,
  };
}

function toCampusBuilding(campus: CampusBuildingJson): NewCampusBuilding {
  return {
    code: campus.code,
    latitude: campus.latitude,
    longitude: campus.longitude,
    name: campus.name,
    slug: campus.id,
    subtitle: campus.subtitle ?? null,
  };
}

// On a slug conflict, overwrite every column except the primary key and the slug itself.
function conflictUpdateSet(table: typeof dormTable | typeof campusBuildingTable) {
  const { id: _id, slug: _slug, ...columns } = getTableColumns(table);
  return Object.fromEntries(
    Object.entries(columns).map(([key, column]) => [key, sql.raw(`excluded."${column.name}"`)]),
  );
}

await configureLogger();
const client = createSqlClient();

try {
  const db = drizzle({ client });
  const updatedAt = new Date();
  const campusBuildings = await readCampusBuildings();
  const buildings = await readBuildings(campusBuildings);
  const campus = campusBuildings.map((building) => toCampusBuilding(building));
  const dorms = buildings.map((building) => toDorm(building, updatedAt));

  const existing = await db.transaction(async (tx) => {
    const rows = await tx.select({ slug: dormTable.slug }).from(dormTable);
    await tx
      .insert(campusBuildingTable)
      .values(campus)
      .onConflictDoUpdate({
        set: conflictUpdateSet(campusBuildingTable),
        target: campusBuildingTable.slug,
      });
    await tx
      .insert(dormTable)
      .values(dorms)
      .onConflictDoUpdate({ set: conflictUpdateSet(dormTable), target: dormTable.slug });
    return new Set(rows.map((row) => row.slug));
  });

  const updated = dorms.filter((dorm) => existing.has(dorm.slug)).length;
  logger.info(
    `Seeded ${dorms.length} dorms (${dorms.length - updated} inserted, ${updated} updated) and ${campus.length} campus buildings`,
  );
} catch (error: unknown) {
  logger.fatal("Seeding failed: {error}", { error: nodeError(error) });
  Deno.exitCode = 1;
} finally {
  await client.end();
}
