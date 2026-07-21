import * as client from "@panva/openid-client";

/**
 * Settings for the Keycloak OIDC client provisioned via ScottyLabs
 * governance's `oidc_client` feature. Populated into the environment by
 * secretspec; see secretspec.toml.
 */
export interface OidcSettings {
  clientId: string;
  clientSecret: string;
  keycloakUrl: string;
  keycloakRealm: string;
  oauthRelayUrl: string;
}

/**
 * Reads the OIDC settings from the environment, or `undefined` if the
 * Keycloak client hasn't been provisioned yet for this environment. Login
 * is disabled (falls back to a no-op redirect) when this returns
 * `undefined`, so the app can still start and be developed against without
 * a registered client.
 */
export function loadOidcSettings(): OidcSettings | undefined {
  const clientId = Deno.env.get("OIDC_CLIENT_ID");
  const clientSecret = Deno.env.get("OIDC_CLIENT_SECRET");
  const keycloakUrl = Deno.env.get("KEYCLOAK_URL");
  const keycloakRealm = Deno.env.get("KEYCLOAK_REALM");
  const oauthRelayUrl = Deno.env.get("OAUTH_RELAY_URL");

  if (!clientId || !clientSecret || !keycloakUrl || !keycloakRealm || !oauthRelayUrl) {
    return undefined;
  }

  return { clientId, clientSecret, keycloakUrl, keycloakRealm, oauthRelayUrl };
}

/**
 * Runs OIDC discovery against Keycloak and returns a configured client.
 * Meant to be built once at startup, the way Keycloak discovery normally
 * works.
 */
export async function buildOidcConfig(settings: OidcSettings): Promise<client.Configuration> {
  const issuer = new URL(
    `${settings.keycloakUrl.replace(/\/$/u, "")}/realms/${settings.keycloakRealm}`,
  );
  const config = await client.discovery(issuer, settings.clientId, settings.clientSecret);

  // Keycloak issues the authorization code against `OAUTH_RELAY_URL` (Ricochet's
  // fixed relay address), not our own callback route -- Ricochet forwards the
  // browser to us afterwards. openid-client derives the token endpoint's
  // `redirect_uri` parameter from the callback URL it's handed, which would be
  // *our* URL here, not the one Keycloak actually issued the code against.
  // Rewrite it back to the relay URL so the token exchange matches what was
  // registered with Keycloak (this is openid-client's documented workaround
  // for redirect URIs served by a relay/proxy).
  config[client.customFetch] = (url, options) => {
    if (
      options.body instanceof URLSearchParams &&
      options.body.get("grant_type") === "authorization_code"
    ) {
      options.body.set("redirect_uri", settings.oauthRelayUrl);
    }
    // openid-client's `CustomFetchOptions.body` is typed as a union that includes a
    // generic `Uint8Array`, which doesn't structurally match lib.dom's `BodyInit` in
    // this TypeScript version -- structurally fine for the real global `fetch` at
    // runtime, just not something the type checker can see through.
    return fetch(url, options as RequestInit);
  };

  return config;
}

interface RelayState {
  return_to: string;
  csrf: string;
}

/**
 * Builds the opaque `state` value sent to Keycloak as part of the
 * authorization request. Ricochet decodes `return_to` out of this to know
 * where to forward the browser once the IdP redirects back to its own fixed
 * relay URL, and we check `csrf` against a short-lived cookie on callback to
 * guard against login CSRF.
 */
export function createRelayState(returnTo: string): string {
  const payload: RelayState = { return_to: returnTo, csrf: crypto.randomUUID() };
  return encodeBase64Url(JSON.stringify(payload));
}

function encodeBase64Url(value: string): string {
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

/** Builds the URL to redirect the browser to in order to start a login. */
export function buildLoginUrl(
  config: client.Configuration,
  settings: OidcSettings,
  state: string,
): URL {
  return client.buildAuthorizationUrl(config, {
    redirect_uri: settings.oauthRelayUrl,
    scope: "openid email profile",
    state,
  });
}

/**
 * Exchanges the authorization code for tokens and returns the ID token's
 * claims. `currentUrl` is our own callback URL (as forwarded by Ricochet),
 * carrying the `code` and `state` query parameters.
 */
export async function exchangeCodeForClaims(
  config: client.Configuration,
  currentUrl: URL | Request,
  expectedState: string,
) {
  const tokens = await client.authorizationCodeGrant(config, currentUrl, { expectedState });
  return tokens.claims();
}
