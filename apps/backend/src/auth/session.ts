import type { CookieOptions } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { sessionTable } from "../db/schema.ts";

export const SESSION_COOKIE_NAME = "session_id";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export const OAUTH_STATE_COOKIE_NAME = "oauth_state";
const OAUTH_STATE_DURATION_S = 10 * 60;

const isProd = (Deno.env.get("APP_URL") ?? "").startsWith("https://");

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: isProd,
};

export const sessionCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: SESSION_DURATION_MS / 1000,
};

export const oauthStateCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: OAUTH_STATE_DURATION_S,
};

export async function createSession(userId: number): Promise<string> {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.insert(sessionTable).values({ expiresAt, id, userId });
  return id;
}

export async function getSessionUserId(sessionId: string): Promise<number | undefined> {
  const [row] = await db.select().from(sessionTable).where(eq(sessionTable.id, sessionId)).limit(1);
  if (!row) return undefined;

  if (row.expiresAt.getTime() < Date.now()) {
    await deleteSession(sessionId);
    return undefined;
  }

  return row.userId;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}
