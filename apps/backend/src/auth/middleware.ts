import type { Elysia } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { userTable } from "../db/schema.ts";
import { getSessionUserId, SESSION_COOKIE_NAME } from "./session.ts";

/**
 * Attaches `user` to the context when a valid session cookie is present,
 * `undefined` otherwise.
 *
 * Unlike the Bearer-token resource-server model this replaced, this does
 * NOT force a 401 on a missing/invalid session -- guest browsing is a real
 * product mode here (see the launch page's "Continue as guest" option), so
 * individual routes that require a logged-in user check `user` themselves
 * and respond with 401 if it's missing (see `/api/me` in index.ts).
 *
 * Exported as a plain function (rather than a pre-built `Elysia` instance)
 * so it can be `.use()`'d directly into the same route-definition chain in
 * index.ts -- Elysia only propagates a `.derive()`'s type to routes further
 * down that same chain, not to separately-built instances merged in later.
 */
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
