import type { Elysia } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { userTable } from "../db/schema.ts";
import { getSessionUserId, SESSION_COOKIE_NAME } from "./session.ts";

export const sessionAuth = (app: Elysia) =>
  app.derive(async ({ cookie }) => {
    const sessionId = cookie[SESSION_COOKIE_NAME]?.value;
    if (typeof sessionId !== "string" || sessionId === "") {
      return { user: undefined };
    }

    const userId = await getSessionUserId(sessionId);
    if (userId === undefined) {
      return { user: undefined };
    }

    const [user] = await db.select().from(userTable).where(eq(userTable.id, userId)).limit(1);
    return { user };
  });
