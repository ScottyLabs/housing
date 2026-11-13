import { Link, useParams } from "react-router-dom";
import { type Building, useBuildings } from "@/components/BuildingContext";
import { ReviewCard, SummaryCard } from "@/components/reviews/ReviewCards";
import useDormReviews from "@/hooks/useDormReviews";

const PAGE_SIZE = 24;

function AllReviews({ building }: { building: Building }) {
  const { averages, count, isLoadingMore, loadMore, reviews, status } = useDormReviews(
    building.id,
    PAGE_SIZE,
  );

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SummaryCard buildingName={building.name} count={count} averages={averages} />
        <img
          src={building.media.mainImage}
          alt={building.name}
          className="hidden h-full max-h-[300px] w-full rounded-[18px] object-cover lg:col-span-2 lg:block"
        />
      </div>

      {status === "loading" && <p className="mt-6 text-[14px] text-gray-600">Loading reviews...</p>}
      {status === "failed" && (
        <p className="mt-6 text-[14px] text-gray-600">Reviews couldn&apos;t be loaded right now.</p>
      )}
      {status === "loaded" && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} buildingId={building.id} />
          ))}
        </div>
      )}
      {reviews.length < count && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoadingMore}
            className="h-[48px] rounded-2xl bg-brand-buttongray px-8 text-[16px] font-medium transition-colors hover:bg-[#d7dfe3] disabled:opacity-50"
          >
            {isLoadingMore ? "Loading..." : "Show more reviews"}
          </button>
        </div>
      )}
    </>
  );
}

export default function BuildingReviewsPage() {
  const { id } = useParams();
  const building = useBuildings().find((candidate) => candidate.id === id);

  return (
    <div className="mx-auto w-full max-w-[1140px] px-6 pb-12 pt-[26px]">
      <Link
        to={building ? `/building/${building.id}` : "/building-options"}
        className="text-[14px] text-gray-700 hover:underline"
      >
        &lsaquo; {building?.name ?? "All buildings"}
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/unsorted-icons/reviews.svg" alt="" aria-hidden="true" className="h-9 w-9" />
          <h1 className="text-[28px] font-bold leading-none">All Reviews</h1>
        </div>
        {building && (
          <Link
            to={`/reviews/${building.id}`}
            className="rounded-2xl bg-brand-primary px-5 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#f1872c]"
          >
            Review {building.name}
          </Link>
        )}
      </div>
      {building ? (
        <AllReviews building={building} />
      ) : (
        <p className="mt-6 text-[18px]">We couldn&apos;t find that building.</p>
      )}
    </div>
  );
}
