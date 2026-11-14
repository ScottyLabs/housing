import type { SelectOption } from "@/components/DropdownButton";

export const GENDER_ANSWERS = ["male", "female", "nb-male", "nb-female", "nb-inclusive"] as const;

export const YEAR_ANSWERS = ["first-year", "sophomore", "junior", "senior"] as const;

export const GOALS = ["Exercise", "Cook", "Meet new people", "Study hard"] as const;

export const ACCOMMODATIONS = [
  "Service Animal",
  "En suite kitchen",
  "Ground floor room",
  "Strobe fire alarm & doorbell",
  "Wheelchair accessible",
  "Climate control: AC",
  "En suite bathroom",
  "Elevator access",
  "Single room",
  "Personal care assistant",
] as const;

export const AMENITIES = [
  "Air conditioning",
  "En suite bathroom",
  "En suite kitchen",
  "Common areas",
  "Kitchen access",
] as const;

const GENDER_LABELS: Record<(typeof GENDER_ANSWERS)[number], string> = {
  female: "Female",
  male: "Male",
  "nb-female": "Non-Binary (female dorms)",
  "nb-inclusive": "Non-Binary (gender inclusive)",
  "nb-male": "Non-Binary (male dorms)",
};

const YEAR_LABELS: Record<(typeof YEAR_ANSWERS)[number], string> = {
  "first-year": "First-Year",
  junior: "Junior",
  senior: "Senior",
  sophomore: "Sophomore",
};

export const GENDER_OPTIONS: SelectOption[] = GENDER_ANSWERS.map((value) => ({
  label: GENDER_LABELS[value],
  value,
}));

export const YEAR_OPTIONS: SelectOption[] = YEAR_ANSWERS.map((value) => ({
  label: YEAR_LABELS[value],
  value,
}));

/** Undefined means "not changed", and anything that isn't one of `values` clears the answer with null. */
export function pickOption<T extends string>(
  values: readonly T[],
  value?: string,
): T | null | undefined {
  if (value === undefined) return undefined;
  return values.find((candidate) => candidate === value) ?? null;
}

/** Drops anything that isn't one of `values`; undefined means "not changed". */
export function keepOptions<T extends string>(
  values: readonly T[],
  selected?: string[],
): T[] | undefined {
  return selected?.filter((item): item is T => values.some((candidate) => candidate === item));
}
