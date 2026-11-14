export const logoLinkState = { fromLogo: true };

export function cameFromLogo(state: unknown): boolean {
  return (
    typeof state === "object" && state !== null && "fromLogo" in state && state.fromLogo === true
  );
}
