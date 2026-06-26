// NOTE: When someone does implement this, please refer to https://elysiajs.com/integrations/drizzle to properly integrate with ElysiaJS
import { pgTable, serial, text } from "drizzle-orm/pg-core";

/**
 * Placeholder
 */
export const placeholderTable = pgTable("placeholder", {
  id: serial("id").primaryKey(),
  value: text("value").notNull(),
});
