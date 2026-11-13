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

export const RATING_LABELS: Array<{ key: RatingKey; label: string }> = [
  { key: "ratingOverall", label: "Overall Experience" },
  { key: "ratingAmenities", label: "Amenities" },
  { key: "ratingRoomQuality", label: "Room Quality" },
  { key: "ratingAtmosphere", label: "Atmosphere" },
];

export const DEFAULT_RATING = 3;

export const defaultRatings: Ratings = {
  ratingAmenities: DEFAULT_RATING,
  ratingAtmosphere: DEFAULT_RATING,
  ratingOverall: DEFAULT_RATING,
  ratingRoomQuality: DEFAULT_RATING,
};

export interface ReviewDraft {
  body: string;
  classYear: string;
  ratings: Ratings;
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

export interface RatingAverages {
  amenities: number | null;
  atmosphere: number | null;
  overall: number | null;
  roomQuality: number | null;
}

export interface DormReview {
  authorName: string;
  body: string;
  id: number;
  isMine: boolean;
  livedTerm: string | null;
  livedYear: string | null;
  ratings: Record<RatingKey, number | null>;
  submittedAt: Date | null;
}

type LooseNumber = string | number | null;

export interface ApiReview {
  authorName: string;
  body: string | null;
  id: string | number;
  isMine: boolean;
  livedTerm: string | null;
  livedYear: string | null;
  ratingAmenities: LooseNumber;
  ratingAtmosphere: LooseNumber;
  ratingOverall: LooseNumber;
  ratingRoomQuality: LooseNumber;
  submittedAt: unknown;
}

function toNumber(value: LooseNumber): number | null {
  return value === null ? null : Number(value);
}

function toDate(value: unknown): Date | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toDormReview(review: ApiReview): DormReview {
  return {
    authorName: review.authorName,
    body: review.body ?? "",
    id: Number(review.id),
    isMine: review.isMine,
    livedTerm: review.livedTerm,
    livedYear: review.livedYear,
    ratings: {
      ratingAmenities: toNumber(review.ratingAmenities),
      ratingAtmosphere: toNumber(review.ratingAtmosphere),
      ratingOverall: toNumber(review.ratingOverall),
      ratingRoomQuality: toNumber(review.ratingRoomQuality),
    },
    submittedAt: toDate(review.submittedAt),
  };
}

export function formatReviewDate(date: Date): string {
  return date.toLocaleDateString("en-US", { day: "numeric", month: "numeric", year: "2-digit" });
}

export function livedHereText(
  livedTerm: string | null,
  livedYear: string | null,
): string | undefined {
  const parts = [classYearLabel(livedTerm) ?? livedTerm, livedYear].filter(
    (part): part is string => part !== null && part !== undefined && part !== "",
  );
  return parts.length === 0 ? undefined : `Lived here ${parts.join(", ")}`;
}

export const AVERAGE_KEYS: Record<RatingKey, keyof RatingAverages> = {
  ratingAmenities: "amenities",
  ratingAtmosphere: "atmosphere",
  ratingOverall: "overall",
  ratingRoomQuality: "roomQuality",
};
