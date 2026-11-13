const MIN_RATING = 1;
const MAX_RATING = 5;

function EndMarker({ side }: { side: "left" | "right" }) {
  return (
    <span
      className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-brand-primary bg-white ${side === "left" ? "left-0" : "right-0"}`}
    />
  );
}

export default function RatingBar({ label, value }: { label: string; value: number | null }) {
  if (value === null) {
    return <span className="text-[13px] text-gray-500">No rating</span>;
  }
  const clamped = Math.min(Math.max(value, MIN_RATING), MAX_RATING);
  const percent = ((clamped - MIN_RATING) / (MAX_RATING - MIN_RATING)) * 100;
  const shown = String(Math.round(clamped * 10) / 10);

  return (
    <div className="relative h-4 w-full">
      <span className="sr-only">
        {label}: {shown} out of {MAX_RATING}
      </span>
      <span aria-hidden="true">
        <span className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#d1d5db]" />
        <span
          className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-brand-primary"
          style={{ width: `${percent}%` }}
        />
        <EndMarker side="left" />
        <EndMarker side="right" />
        <span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary"
          style={{ left: `${percent}%` }}
        />
      </span>
    </div>
  );
}
