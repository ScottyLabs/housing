import { z } from "zod";

const MAJOR_MAX_LENGTH = 100;

const genderHousing = z.enum(["male", "female", "nb-male", "nb-female", "nb-inclusive"]);

const year = z.enum(["first-year", "sophomore", "junior", "senior"]);

const goals = z.enum(["Exercise", "Cook", "Meet new people", "Study hard"]);

const accommodations = z.enum([
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
]);

const amenities = z.enum([
  "Air conditioning",
  "En suite bathroom",
  "En suite kitchen",
  "Common areas",
  "Kitchen access",
]);

const frequency = z.int().min(1).max(5);

function onlyOnce(items: string[]): boolean {
  return new Set(items).size === items.length;
}

export const preferencesBody = z.object({
  accommodations: z.array(accommodations).refine(onlyOnce, "Pick each option once").nullish(),
  completed: z.boolean().optional(),
  cookingFrequency: frequency.nullish(),
  goals: z.array(goals).refine(onlyOnce, "Pick each option once").nullish(),
  gymFrequency: frequency.nullish(),
  major: z.string().trim().min(1).max(MAJOR_MAX_LENGTH).nullish(),
  needsAloneTime: frequency.nullish(),
  preferredAmenities: z.array(amenities).refine(onlyOnce, "Pick each option once").nullish(),
  preferredGenderHousing: genderHousing.nullish(),
  productiveAroundOthers: frequency.nullish(),
  socialFrequency: frequency.nullish(),
  year: year.nullish(),
});
