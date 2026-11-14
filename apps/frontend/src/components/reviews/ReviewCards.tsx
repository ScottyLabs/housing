import { Link } from "react-router-dom";
import RatingBar from "@/components/reviews/RatingBar";
import {
  CARD_ROWS,
  type CardRatings,
  type DormReview,
  formatReviewDate,
  livedHereText,
  type RatingAverages,
  reviewCardRatings,
  summaryCardRatings,
} from "@/data/reviews";

function RatingRows({ ratings }: { ratings: CardRatings }) {
  return (
    <dl className="mt-4 flex flex-col gap-2.5">
      {CARD_ROWS.map(({ key, label }) => (
        <div key={key} className="grid grid-cols-[130px_1fr] items-center gap-3">
          <dt className={`text-[14px] ${key === "overall" ? "font-semibold" : ""}`}>{label}</dt>
          <dd>
            <RatingBar label={label} value={ratings[key]} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function summaryText(buildingName: string, count: number): string {
  if (count === 0)
    return `No reviews yet. Be the first to share what living in ${buildingName} is like.`;
  const reviews = count === 1 ? "1 student review" : `${count.toLocaleString()} student reviews`;
  return `Average ratings from ${reviews} of ${buildingName}.`;
}

export function SummaryCard({
  buildingName,
  count,
  averages,
}: {
  buildingName: string;
  count: number;
  averages: RatingAverages;
}) {
  return (
    <div className="rounded-[18px] border border-brand-primary/20 bg-[#fdebd9] p-5">
      <div className="flex items-center gap-2">
        <img src="/unsorted-icons/summary.svg" alt="" aria-hidden="true" className="h-5 w-5" />
        <h3 className="text-[16px] font-semibold">Summary</h3>
      </div>
      <p className="mt-3 text-[14px] leading-snug">{summaryText(buildingName, count)}</p>
      {count > 0 && <RatingRows ratings={summaryCardRatings(averages)} />}
    </div>
  );
}

function ReviewHeader({ review, buildingId }: { review: DormReview; buildingId: string }) {
  const lived = livedHereText(review.livedTerm, review.livedYear);
  return (
    <div className="flex items-start gap-3">
      <img src="/profile.svg" alt="" aria-hidden="true" className="h-9 w-9 rounded-full" />
      <div className="min-w-0 flex-1">
        <p className="text-[14px]">
          <span className="font-semibold">{review.authorName}</span>
          {review.submittedAt && ` on ${formatReviewDate(review.submittedAt)}`}
          {review.isMine && (
            <>
              {" \u00B7 "}
              <Link to={`/reviews/${buildingId}`} className="text-brand-primary hover:underline">
                Edit yours
              </Link>
            </>
          )}
        </p>
        {lived !== undefined && <p className="text-[12px] text-gray-600">{lived}</p>}
      </div>
    </div>
  );
}

export function ReviewCard({
  review,
  buildingId,
  clamp = false,
}: {
  review: DormReview;
  buildingId: string;
  clamp?: boolean;
}) {
  return (
    <article className="flex flex-col rounded-[18px] border border-black/10 bg-brand-menugray p-5">
      <ReviewHeader review={review} buildingId={buildingId} />
      {review.body !== "" && (
        <p
          className={`mt-3 whitespace-pre-line break-words text-[14px] leading-snug ${clamp ? "line-clamp-4" : ""}`}
        >
          {review.body}
        </p>
      )}
      <div className="mt-auto">
        <RatingRows ratings={reviewCardRatings(review.ratings)} />
      </div>
    </article>
  );
}
