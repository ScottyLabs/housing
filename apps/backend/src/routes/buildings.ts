import { count } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { campusBuildingTable, dormTable, reviewTable } from "../db/schema.ts";
import { dbPlugin } from "../plugins/db.ts";
import { toBuilding, toCampusBuilding } from "../utils/buildings.ts";
import { buildingSchema, campusBuildingSchema } from "./building-schemas.ts";
import { noReviews, ratingAverages, toSummary } from "./review-shared.ts";

export const buildingsRoute = new Elysia()
  .use(dbPlugin)

  // Every dorm in seed order, each with its review summary.
  .get(
    "/buildings",
    async ({ db }) => {
      const [dorms, summaries] = await Promise.all([
        db.select().from(dormTable).orderBy(dormTable.id),
        db
          .select({ ...ratingAverages, count: count(), dormId: reviewTable.dormId })
          .from(reviewTable)
          .groupBy(reviewTable.dormId),
      ]);
      const summaryByDorm = new Map(summaries.map((row) => [row.dormId, toSummary(row)]));
      const empty = toSummary(noReviews);
      return dorms.map((dorm) => toBuilding(dorm, summaryByDorm.get(dorm.id) ?? empty));
    },
    { response: { 200: t.Array(buildingSchema) } },
  )

  // Academic and other non-residential buildings, used as map origins and distance landmarks.
  .get(
    "/campus-buildings",
    async ({ db }) => {
      const rows = await db.select().from(campusBuildingTable).orderBy(campusBuildingTable.id);
      return rows.map((row) => toCampusBuilding(row));
    },
    { response: { 200: t.Array(campusBuildingSchema) } },
  );
