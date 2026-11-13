import { useCallback, useEffect, useState } from "react";
import client from "@/api/client";
import { type DormReview, type RatingAverages, toDormReview } from "@/data/reviews";

export interface DormReviews {
  status: "loading" | "loaded" | "failed";
  count: number;
  averages: RatingAverages;
  reviews: DormReview[];
  isLoadingMore: boolean;
  loadMore: () => void;
}

interface Result {
  key: string;
  status: "loaded" | "failed";
  count: number;
  averages: RatingAverages;
  reviews: DormReview[];
}

const noAverages: RatingAverages = {
  amenities: null,
  atmosphere: null,
  overall: null,
  roomQuality: null,
};

async function fetchPage(slug: string, limit: number, offset: number) {
  const { data } = await client.GET("/api/dorms/{slug}/reviews", {
    params: { path: { slug }, query: { limit, offset } },
  });
  if (!data) throw new Error("Could not load reviews");
  return {
    averages: data.summary.averages,
    count: Number(data.summary.count),
    reviews: data.reviews.map(toDormReview),
  };
}

function useFirstPage(
  key: string,
  slug: string,
  pageSize: number,
  setResult: (result: Result) => void,
) {
  useEffect(() => {
    let active = true;
    fetchPage(slug, pageSize, 0).then(
      (page) => {
        if (active) setResult({ key, status: "loaded", ...page });
      },
      () => {
        if (active) {
          setResult({ averages: noAverages, count: 0, key, reviews: [], status: "failed" });
        }
      },
    );
    return () => {
      active = false;
    };
  }, [key, slug, pageSize, setResult]);
}

export default function useDormReviews(slug: string, pageSize: number): DormReviews {
  const key = `${slug}:${pageSize}`;
  const [result, setResult] = useState<Result>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  useFirstPage(key, slug, pageSize, setResult);

  const current = result?.key === key ? result : undefined;
  const loadedCount = current?.reviews.length ?? 0;

  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    fetchPage(slug, pageSize, loadedCount).then(
      (page) => {
        setResult((previous) =>
          previous?.key === key
            ? { ...previous, count: page.count, reviews: [...previous.reviews, ...page.reviews] }
            : previous,
        );
        setIsLoadingMore(false);
      },
      () => {
        setIsLoadingMore(false);
      },
    );
  }, [key, slug, pageSize, loadedCount]);

  return {
    averages: current?.averages ?? noAverages,
    count: current?.count ?? 0,
    isLoadingMore,
    loadMore,
    reviews: current?.reviews ?? [],
    status: current?.status ?? "loading",
  };
}
