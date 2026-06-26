import { placeholderTable } from "../db/index.ts";
import { Elysia, t } from "elysia";
import { dbPlugin } from "../plugins/db.ts";
import { spread } from "../utils/typebox.ts";

const placeholder = spread(placeholderTable, "insert");
const addPlaceholder = t.Object({
  value: placeholder.value,
});

export const placeholderRoutes = new Elysia({ prefix: "/placeholder" }).use(dbPlugin).post(
  "/",
  ({ body, db }) => {
    const result = db.insert(placeholderTable).values(body).returning();
    return result;
  },
  {
    body: addPlaceholder,
  },
);
