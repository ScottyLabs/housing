// Formatting helpers for the review routes, kept apart so they can be tested without a database.

const FALLBACK_NAME = "CMU Student";

export function displayName(fullName: string, andrewId?: string): string {
  const trimmed = fullName.trim();
  if (trimmed === "" || trimmed === "Unknown" || trimmed === andrewId) return FALLBACK_NAME;
  const parts = trimmed.split(/\s+/u);
  const first = parts[0] ?? FALLBACK_NAME;
  const last = parts.length > 1 ? parts.at(-1) : undefined;
  if (last === undefined) return first;
  return `${first} ${last.charAt(0).toUpperCase()}.`;
}

export function toAverage(value: string | null): number | null {
  if (value === null) return null;
  return Math.round(Number(value) * 100) / 100;
}

export const SCHOOL_YEAR_PATTERN = /^(20\d{2})\/(20\d{2})$/u;

export function isSchoolYear(value: string, today: Date): boolean {
  const match = SCHOOL_YEAR_PATTERN.exec(value);
  if (match === null) return false;
  const start = Number(match[1]);
  return Number(match[2]) === start + 1 && start <= today.getFullYear();
}
