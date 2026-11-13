import { useEffect, useState } from "react";
import client from "@/api/client";
import { DEFAULT_RATING, emptyDraft, type ReviewDraft } from "@/data/reviews";

type SavedRating = string | number | null;

interface SavedReview {
  body: string | null;
  livedTerm: string | null;
  livedYear: string | null;
  ratingAmenities: SavedRating;
  ratingAtmosphere: SavedRating;
  ratingOverall: SavedRating;
  ratingRoomQuality: SavedRating;
}

function toRating(value: SavedRating): number {
  return value === null ? DEFAULT_RATING : Number(value);
}

function draftFromSaved(saved: SavedReview): ReviewDraft {
  return {
    body: saved.body ?? "",
    classYear: saved.livedTerm ?? "",
    ratings: {
      ratingAmenities: toRating(saved.ratingAmenities),
      ratingAtmosphere: toRating(saved.ratingAtmosphere),
      ratingOverall: toRating(saved.ratingOverall),
      ratingRoomQuality: toRating(saved.ratingRoomQuality),
    },
    schoolYear: saved.livedYear ?? "",
  };
}

export function useReviewDraft(slug: string) {
  const [draft, setDraft] = useState<ReviewDraft>(emptyDraft);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let active = true;
    void client.GET("/api/me/reviews/{slug}", { params: { path: { slug } } }).then(({ data }) => {
      if (!active || !data || !("id" in data)) return;
      setDraft(draftFromSaved(data));
      setIsEditing(true);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  const update = (fields: Partial<ReviewDraft>) => {
    setDraft((previous) => ({ ...previous, ...fields }));
  };

  return { draft, isEditing, update };
}

export type SaveResult = "saved" | "signed-out" | "failed";

export async function saveReview(slug: string, draft: ReviewDraft): Promise<SaveResult> {
  try {
    const { response } = await client.PUT("/api/me/reviews/{slug}", {
      body: {
        body: draft.body,
        livedTerm: draft.classYear,
        livedYear: draft.schoolYear,
        ratingAmenities: draft.ratings.ratingAmenities,
        ratingAtmosphere: draft.ratings.ratingAtmosphere,
        ratingOverall: draft.ratings.ratingOverall,
        ratingRoomQuality: draft.ratings.ratingRoomQuality,
      },
      params: { path: { slug } },
    });
    if (response.ok) return "saved";
    return response.status === 401 ? "signed-out" : "failed";
  } catch {
    return "failed";
  }
}
