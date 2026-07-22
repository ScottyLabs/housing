import type { IDToken } from "@panva/openid-client";
import { db } from "../db/index.ts";
import { userTable } from "../db/schema.ts";

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
