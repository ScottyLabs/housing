// Where to send someone after they sign in. Only paths on this site are allowed, so a crafted login link (for example /api/auth/login?next=https://evil.example) cannot send people elsewhere.

const MAX_PATH_LENGTH = 512;
const FIRST_PRINTABLE = 0x20;
const DELETE = 0x7f;

function hasControlCharacter(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.codePointAt(index) ?? 0;
    if (code < FIRST_PRINTABLE || code === DELETE) return true;
  }
  return false;
}

/** Returns `value` if it is a safe same-site page path such as "/reviews/donner", else undefined. */
export function safeRedirectPath(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > MAX_PATH_LENGTH) return undefined;
  // Must be a path on this site: "/x" but not "//host" or "/\host", which browsers treat as other sites.
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return undefined;
  if (hasControlCharacter(value)) return undefined;
  // API routes are not pages; landing on one (for example /api/auth/logout) would be confusing.
  if (value === "/api" || value.startsWith("/api/")) return undefined;
  return value;
}
