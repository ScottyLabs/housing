import type { IDToken } from "@panva/openid-client";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { userPreferencesTable, userTable } from "../db/schema.ts";

export async function getOrCreateUser(auth: IDToken) {
  const sub = auth.sub;

  const preferredUsername =
    typeof auth.preferred_username === "string" ? auth.preferred_username : undefined;
  const name = typeof auth.name === "string" ? auth.name : undefined;
  const andrewId = preferredUsername ?? sub;
  const resolvedName = name ?? preferredUsername ?? "Unknown";

  const [user] = await db
    .insert(userTable)
    .values({ andrewId, name: resolvedName, oidcSubject: sub })
    .onConflictDoUpdate({
      set: { andrewId, name: resolvedName },
      target: userTable.oidcSubject,
    })
    .returning();

  return user;
}

export async function hasPreferences(userId: number): Promise<boolean> {
  const rows = await db
    .select({ id: userPreferencesTable.id })
    .from(userPreferencesTable)
    .where(eq(userPreferencesTable.userId, userId))
    .limit(1);
  return rows.length > 0;
}
