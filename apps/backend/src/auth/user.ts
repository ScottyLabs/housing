import type { IDToken } from "@panva/openid-client";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { userTable } from "../db/schema.ts";

export async function getOrCreateUser(auth: IDToken) {
  const sub = auth.sub;

  const [existing] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.oidcSubject, sub))
    .limit(1);
  if (existing) return existing;

  const preferredUsername =
    typeof auth.preferred_username === "string" ? auth.preferred_username : undefined;
  const name = typeof auth.name === "string" ? auth.name : undefined;

  const [created] = await db
    .insert(userTable)
    .values({
      andrewId: preferredUsername ?? sub,
      createdTime: new Date(),
      name: name ?? preferredUsername ?? "Unknown",
      oidcSubject: sub,
    })
    .returning();

  return created;
}
