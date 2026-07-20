import { oauth2ResourceServer } from "elysia-oauth2-resource-server";

/* oxlint-disable typescript/no-unsafe-assignment, typescript/no-unsafe-call, typescript/no-unsafe-member-access --
   oxlint's type-aware pass doesn't resolve Deno's ambient globals (no tsconfig for this Deno backend), so
   `Deno` resolves to an error type here. Deno.env.get() returns `string | undefined` at runtime. */
const issuer = Deno.env.get("OIDC_ISSUER") ?? "https://idp.scottylabs.org/realms/scottylabs";

const jwksUri = `${issuer.replace(/\/$/u, "")}/protocol/openid-connect/certs`;

export const jwtAuth = oauth2ResourceServer({
  jwksUri,
  issuer,
});
