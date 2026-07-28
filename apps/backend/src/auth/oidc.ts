import * as client from "@panva/openid-client";

export interface OidcSettings {
  clientId: string;
  clientSecret: string;
  keycloakUrl: string;
  keycloakRealm: string;
  oauthRelayUrl: string;
}

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

export async function buildOidcConfig(settings: OidcSettings): Promise<client.Configuration> {
  const issuer = new URL(
    `${settings.keycloakUrl.replace(/\/$/u, "")}/realms/${settings.keycloakRealm}`,
  );
  const config = await client.discovery(issuer, settings.clientId, settings.clientSecret);

  config[client.customFetch] = (url, options) => {
    if (
      options.body instanceof URLSearchParams &&
      options.body.get("grant_type") === "authorization_code"
    ) {
      options.body.set("redirect_uri", settings.oauthRelayUrl);
    }
    return fetch(url, options as RequestInit);
  };

  return config;
}

interface RelayState {
  return_to: string;
  csrf: string;
}

export function createRelayState(returnTo: string): string {
  const payload: RelayState = { return_to: returnTo, csrf: crypto.randomUUID() };
  return encodeBase64Url(JSON.stringify(payload));
}

function encodeBase64Url(value: string): string {
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

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

export async function exchangeCodeForClaims(
  config: client.Configuration,
  currentUrl: URL | Request,
  expectedState: string,
) {
  const tokens = await client.authorizationCodeGrant(config, currentUrl, { expectedState });
  return tokens.claims();
}
