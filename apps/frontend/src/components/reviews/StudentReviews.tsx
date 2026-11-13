import { Link } from "react-router-dom";
import type { Building } from "@/components/BuildingContext";
import { ReviewCard, SummaryCard } from "@/components/reviews/ReviewCards";
import useDormReviews from "@/hooks/useDormReviews";

const PREVIEW_COUNT = 4;

function SeeAllTile({ building, count }: { building: Building; count: number }) {
  return (
    <Link
      to={`/building/${building.id}/reviews`}
      className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-[18px] border border-black/10 bg-brand-menugray p-5 transition-colors hover:bg-brand-buttongray"
    >
      <img src="/unsorted-icons/reviews.svg" alt="" aria-hidden="true" className="h-9 w-9" />
      <span className="text-[16px] font-semibold">See All Reviews</span>
      <span className="text-[13px] text-gray-600">
        {count === 1 ? "1 review" : `${count.toLocaleString()} reviews`}
      </span>
    </Link>
  );
}

export default function StudentReviews({ building }: { building: Building }) {
  const { averages, count, reviews, status } = useDormReviews(building.id, PREVIEW_COUNT);

  return (
    <section aria-labelledby="student-reviews-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5">
        <div className="flex items-center gap-3">
          <img src="/unsorted-icons/reviews.svg" alt="" aria-hidden="true" className="h-9 w-9" />
          <h2 id="student-reviews-heading" className="text-[20px] font-semibold">
            Student Reviews
          </h2>
        </div>
        <Link
          to={`/reviews/${building.id}`}
          className="rounded-2xl bg-brand-primary px-5 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#f1872c]"
        >
          Review {building.name}
        </Link>
      </div>

      {status === "loading" && <p className="text-[14px] text-gray-600">Loading reviews...</p>}
      {status === "failed" && (
        <p className="text-[14px] text-gray-600">Reviews couldn&apos;t be loaded right now.</p>
      )}
      {status === "loaded" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard buildingName={building.name} count={count} averages={averages} />
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} buildingId={building.id} clamp />
          ))}
          {count > 0 && <SeeAllTile building={building} count={count} />}
        </div>
      )}
    </section>
  );
}
