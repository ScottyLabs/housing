import type { SelectOption } from "@/components/DropdownButton";

/** Longest written review the server accepts. */
export const REVIEW_MAX_LENGTH = 5000;

/** Stored in the review's `livedTerm`; matches the survey's year values, plus graduate students. */
export const CLASS_YEAR_OPTIONS: SelectOption[] = [
  { value: "first-year", label: "First Year" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "graduate", label: "Graduate" },
];

export function classYearLabel(value: string | null): string | undefined {
  return CLASS_YEAR_OPTIONS.find((option) => option.value === value)?.label;
}

const SCHOOL_YEARS_SHOWN = 6;
const AUGUST = 7;

/**
 * School years like "2026/2027", newest first, for the review's `livedYear`. A school year starts
 * in August, so in November 2026 the newest is 2026/2027 and in March 2026 it is 2025/2026.
 */
export function schoolYearOptions(today: Date): SelectOption[] {
  const newestStart = today.getMonth() >= AUGUST ? today.getFullYear() : today.getFullYear() - 1;
  return Array.from({ length: SCHOOL_YEARS_SHOWN }, (_, index) => {
    const start = newestStart - index;
    const label = `${start}/${start + 1}`;
    return { label, value: label };
  });
}

export type RatingKey =
  | "ratingOverall"
  | "ratingAmenities"
  | "ratingRoomQuality"
  | "ratingAtmosphere";

export type Ratings = Record<RatingKey, number>;

/** The four ratings, in the order and with the names used on review cards. */
export const RATING_QUESTIONS: Array<{ key: RatingKey; icon: string; question: string }> = [
  {
    key: "ratingOverall",
    icon: "/unsorted-icons/ranking.svg",
    question: "Overall experience",
  },
  {
    key: "ratingAmenities",
    icon: "/unsorted-icons/amenities.svg",
    question: "Amenities (kitchen, laundry, lounges, air conditioning)",
  },
  {
    key: "ratingRoomQuality",
    icon: "/unsorted-icons/room-type/trad-single.svg",
    question: "Room quality",
  },
  {
    key: "ratingAtmosphere",
    icon: "/atmosphere.svg",
    question: "Atmosphere (community, noise, social life)",
  },
];

export const DEFAULT_RATING = 3;

export const defaultRatings: Ratings = {
  ratingAmenities: DEFAULT_RATING,
  ratingAtmosphere: DEFAULT_RATING,
  ratingOverall: DEFAULT_RATING,
  ratingRoomQuality: DEFAULT_RATING,
};

/** What the review form holds before it is saved. */
export interface ReviewDraft {
  body: string;
  /** A CLASS_YEAR_OPTIONS value such as "first-year"; saved as the review's `livedTerm`. */
  classYear: string;
  ratings: Ratings;
  /** A school year such as "2025/2026"; saved as the review's `livedYear`. */
  schoolYear: string;
}

export const emptyDraft: ReviewDraft = {
  body: "",
  classYear: "",
  ratings: defaultRatings,
  schoolYear: "",
};

/** Why the user can't move past `step` yet, or undefined if they can. */
export function stepProblem(step: number, draft: ReviewDraft): string | undefined {
  if (step === 1 && (draft.classYear === "" || draft.schoolYear === "")) {
    return "Pick your year and the school year you lived here.";
  }
  if (step === 3 && draft.body.trim() === "") {
    return "Write a few sentences about living here.";
  }
  return undefined;
}
