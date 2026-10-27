import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DropdownButton from "@/components/DropdownButton";
import Slider from "@/components/Slider";
import { type Building, useBuildings } from "@/components/BuildingContext";

const ratingFields = ["Amenities", "Atmosphere", "Dorm quality", "Overall"] as const;
type RatingField = (typeof ratingFields)[number];
type Ratings = Record<RatingField, number>;

function useReviewPreview(building: Building | undefined, from: string, to: string) {
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  function preview() {
    if (!building) {
      setError("Choose a dorm to review.");
      return;
    }
    if (from > to) {
      setError("The end month must be after the start month.");
      return;
    }
    setError("");
    setShowPreview(true);
  }
  function resetPreview() {
    setError("");
    setShowPreview(false);
  }
  return { error, showPreview, preview, resetPreview };
}

function useReviewDraft(buildings: Building[], requestedBuilding: string) {
  const [buildingId, setBuildingId] = useState(
    buildings.some((building) => building.id === requestedBuilding) ? requestedBuilding : "",
  );
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [ratings, setRatings] = useState<Ratings>({
    Amenities: 3,
    Atmosphere: 3,
    "Dorm quality": 3,
    Overall: 3,
  });
  const building = buildings.find((item) => item.id === buildingId);
  const previewState = useReviewPreview(building, from, to);

  function changeBuilding(value: string) {
    setBuildingId(value);
    previewState.resetPreview();
  }
  function changeMonth(field: "from" | "to", value: string) {
    (field === "from" ? setFrom : setTo)(value);
    previewState.resetPreview();
  }
  function changeRating(field: RatingField, value: number) {
    setRatings((previous) => ({ ...previous, [field]: value }));
    previewState.resetPreview();
  }
  return {
    buildingId,
    building,
    from,
    to,
    ratings,
    changeBuilding,
    changeMonth,
    changeRating,
    ...previewState,
  };
}

function DormField({
  buildings,
  value,
  onChange,
}: {
  buildings: Building[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="max-w-[423px]">
      <h2 className="mb-3 text-[20px] font-semibold">Dorm</h2>
      <DropdownButton
        options={buildings.map((building) => ({ value: building.id, label: building.name }))}
        placeholder="Choose a dorm"
        value={value}
        onChangeAction={onChange}
      />
    </div>
  );
}

function MonthField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2 font-medium">
      {label}
      <input
        type="month"
        required
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className="h-[68px] w-full rounded-2xl border border-black/10 bg-brand-buttongray px-4 text-[18px]"
      />
    </label>
  );
}

function RatingFields({
  ratings,
  onChange,
}: {
  ratings: Ratings;
  onChange: (field: RatingField, value: number) => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      {ratingFields.map((field) => (
        <div key={field} className="grid gap-2 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-6">
          <div className="flex items-center justify-between gap-3 text-[18px] font-medium">
            <span>{field}</span>
            <span className="text-[16px] text-gray-600 sm:hidden">{ratings[field]}/5</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                min={1}
                max={5}
                showTicks
                ariaLabel={field}
                value={ratings[field]}
                onChange={(value) => {
                  onChange(field, value);
                }}
              />
            </div>
            <span className="hidden w-9 text-right text-[16px] font-medium sm:block">
              {ratings[field]}/5
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewPreview({
  building,
  from,
  to,
  ratings,
}: {
  building: Building;
  from: string;
  to: string;
  ratings: Ratings;
}) {
  return (
    <section
      className="mt-8 rounded-[18px] border border-black/10 bg-brand-menugray px-6 py-8 sm:px-8"
      aria-label="Review preview"
    >
      <h2 className="text-[24px] font-semibold">Review preview</h2>
      <p className="mt-2 text-gray-600">This is a preview only. Your review has not been saved.</p>
      <p className="mt-5 font-medium">
        {building.name} · {from} to {to}
      </p>
      <ul className="mt-4 space-y-2">
        {ratingFields.map((field) => (
          <li key={field}>
            {field}: {ratings[field]}/5
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReviewQuestions({
  buildings,
  draft,
}: {
  buildings: Building[];
  draft: ReturnType<typeof useReviewDraft>;
}) {
  return (
    <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-6 py-8 sm:px-8">
      <DormField buildings={buildings} value={draft.buildingId} onChange={draft.changeBuilding} />
      <h2 className="mt-8 text-[20px] font-semibold">When did you live here?</h2>
      <div className="mt-3 grid max-w-[600px] grid-cols-1 gap-4 sm:grid-cols-2">
        <MonthField
          label="From"
          value={draft.from}
          onChange={(value) => {
            draft.changeMonth("from", value);
          }}
        />
        <MonthField
          label="To"
          value={draft.to}
          onChange={(value) => {
            draft.changeMonth("to", value);
          }}
        />
      </div>
      <h2 className="mt-10 text-[24px] font-semibold">Rate your experience</h2>
      <RatingFields ratings={draft.ratings} onChange={draft.changeRating} />
    </div>
  );
}

function ReviewActions({ draft }: { draft: ReturnType<typeof useReviewDraft> }) {
  return (
    <>
      {draft.error && (
        <p role="alert" className="mt-4 text-red-700">
          {draft.error}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          className="rounded-2xl bg-brand-primary px-8 py-4 text-[18px] font-medium text-white hover:bg-[#f1872c]"
        >
          Preview review
        </button>
        <Link
          to={draft.building ? `/building/${draft.building.id}` : "/building-options"}
          className="text-gray-600 underline"
        >
          Cancel
        </Link>
      </div>
    </>
  );
}

export default function Rating() {
  const buildings = useBuildings();
  const [searchParams] = useSearchParams();
  const draft = useReviewDraft(buildings, searchParams.get("building") ?? "");

  return (
    <div className="mx-auto w-full max-w-[1140px] px-6 pb-12 pt-[26px]">
      <h1 className="text-[32px] font-bold">Write a Review</h1>
      <p className="mt-6 rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-6 text-[18px] font-semibold">
        Tell other students about your dorm experience.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          draft.preview();
        }}
        className="mt-6"
      >
        <ReviewQuestions buildings={buildings} draft={draft} />
        <ReviewActions draft={draft} />
      </form>
      {draft.showPreview && draft.building && (
        <ReviewPreview
          building={draft.building}
          from={draft.from}
          to={draft.to}
          ratings={draft.ratings}
        />
      )}
    </div>
  );
}
