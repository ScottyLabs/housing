// apps/frontend/src/app/rating/page.tsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import client from "@/api/client";
import DropdownButton, { type SelectOption } from "@/components/DropdownButton";
import Slider from "@/components/Slider";
import { useBuildingById } from "@/components/BuildingContext";

const SEMESTER_OPTIONS: SelectOption[] = [
  { value: "fall", label: "Fall" },
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
];

const YEAR_OPTIONS: SelectOption[] = Array.from({ length: 8 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: String(year), label: String(year) };
});

interface RatingData {
  semester: string;
  year: string;
  amenitiesRating: number;
  atmosphereRating: number;
  qualityRating: number;
  overallRating: number;
}

const initialRatingData: RatingData = {
  semester: "",
  year: "",
  amenitiesRating: 3,
  atmosphereRating: 3,
  qualityRating: 3,
  overallRating: 3,
};

function RatingSliderRow({
  icon,
  question,
  value,
  onChange,
}: {
  icon: string;
  question: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-start gap-[18px]">
      <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 flex-shrink-0" />
      <div className="flex flex-1 flex-col gap-3">
        <span className="text-[18px] font-medium leading-none">{question}</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-[14px]">
          <span className="hidden whitespace-nowrap text-[18px] font-medium sm:inline">Poor</span>
          <div className="flex-1">
            <Slider min={1} max={5} showTicks value={value} onChange={onChange} />
          </div>
          <span className="hidden whitespace-nowrap text-[18px] font-medium sm:inline">
            Excellent
          </span>
          <div className="flex justify-between text-[18px] font-medium sm:hidden">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SurveyInfo({ buildingName }: { buildingName: string }) {
  return (
    <div className="flex items-center gap-4 rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-6">
      <img
        src="/unsorted-icons/info.svg"
        alt=""
        aria-hidden="true"
        className="h-12 w-12 flex-shrink-0"
      />
      <p className="text-[18px] font-semibold leading-snug">
        You&apos;re reviewing <span className="font-bold">{buildingName}</span>. Your feedback
        helps other students choose where to live.
      </p>
    </div>
  );
}

function StayDetailsCard({
  semester,
  setSemester,
  year,
  setYear,
}: {
  semester: string;
  setSemester: (val: string) => void;
  year: string;
  setYear: (val: string) => void;
}) {
  return (
    <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
      <h2 className="text-[24px] font-semibold leading-none">When did you live there?</h2>
      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="w-full max-w-[423px]">
          <DropdownButton
            options={SEMESTER_OPTIONS}
            placeholder="Semester"
            value={semester}
            onChangeAction={setSemester}
          />
        </div>
        <div className="w-full max-w-[423px]">
          <DropdownButton
            options={YEAR_OPTIONS}
            placeholder="Year"
            value={year}
            onChangeAction={setYear}
          />
        </div>
      </div>
    </div>
  );
}

function RatingsCard({
  data,
  update,
}: {
  data: RatingData;
  update: (fields: Partial<RatingData>) => void;
}) {
  return (
    <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
      <h2 className="text-[24px] font-semibold leading-none">Rate your experience</h2>
      <div className="mt-8 flex flex-col gap-8">
        <RatingSliderRow
          icon="/unsorted-icons/stove.svg"
          question="Amenities — laundry, kitchen, common spaces, etc."
          value={data.amenitiesRating}
          onChange={(val) => {
            update({ amenitiesRating: val });
          }}
        />
        <RatingSliderRow
          icon="/unsorted-icons/texting.svg"
          question="Atmosphere — community, noise level, social vibe"
          value={data.atmosphereRating}
          onChange={(val) => {
            update({ atmosphereRating: val });
          }}
        />
        <RatingSliderRow
          icon="/unsorted-icons/work-with-others.svg"
          question="Dorm quality — room condition, maintenance, cleanliness"
          value={data.qualityRating}
          onChange={(val) => {
            update({ qualityRating: val });
          }}
        />
        <RatingSliderRow
          icon="/unsorted-icons/info.svg"
          question="Overall rating — your general impression of living here"
          value={data.overallRating}
          onChange={(val) => {
            update({ overallRating: val });
          }}
        />
      </div>
    </div>
  );
}

export default function RatingSurvey() {
  const [searchParams] = useSearchParams();
  const buildingId = searchParams.get("buildingId") ?? "";
  const building = useBuildingById(buildingId);
  const navigate = useNavigate();

  const [data, setData] = useState<RatingData>(initialRatingData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (fields: Partial<RatingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    void client
      .POST("/api/ratings", {
        body: {
          buildingId,
          semester: data.semester || null,
          year: data.year || null,
          amenitiesRating: data.amenitiesRating,
          atmosphereRating: data.atmosphereRating,
          qualityRating: data.qualityRating,
          overallRating: data.overallRating,
        },
      })
      .finally(() => {
        setIsSubmitting(false);
        navigate(`/building/${buildingId}`);
      });
  };

  if (!building) return <div>Not found</div>;

  return (
    <div className="mx-auto w-full max-w-[1140px] px-6 pb-12 pt-[26px]">
      <h1 className="text-[32px] font-bold leading-none">Write a Review</h1>
      <div className="mt-6 flex flex-col gap-6">
        <SurveyInfo buildingName={building.name} />
        <StayDetailsCard
          semester={data.semester}
          setSemester={(val) => {
            update({ semester: val });
          }}
          year={data.year}
          setYear={(val) => {
            update({ year: val });
          }}
        />
        <RatingsCard data={data} update={update} />
      </div>
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-[56px] w-[204px] rounded-2xl bg-brand-primary text-[18px] font-medium text-white transition-colors hover:bg-[#f1872c] disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </div>
  );
}