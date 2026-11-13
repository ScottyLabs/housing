import type { Building } from "@/components/BuildingContext";
import Slider from "@/components/Slider";
import SurveyField from "@/components/SurveyField";
import {
  CLASS_YEAR_OPTIONS,
  RATING_QUESTIONS,
  REVIEW_MAX_LENGTH,
  type ReviewDraft,
  schoolYearOptions,
} from "@/data/reviews";
import { InfoCard } from "./ReviewMessages";

export interface StepProps {
  building: Building;
  draft: ReviewDraft;
  update: (fields: Partial<ReviewDraft>) => void;
}

const SCHOOL_YEAR_OPTIONS = schoolYearOptions(new Date());

export function StayStep({ building, draft, update }: StepProps) {
  return (
    <>
      <InfoCard>
        Your review helps future students pick where to live. Other students will see your first
        name and last initial.
      </InfoCard>
      <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
        <h2 className="text-[24px] font-semibold leading-tight">
          When did you live in {building.name}?
        </h2>
        <div className="mt-8 flex flex-col gap-8">
          <SurveyField
            icon="/unsorted-icons/year.svg"
            label="Your year"
            helper="Which year of school you were in while living here"
            placeholder="Pick your year"
            options={CLASS_YEAR_OPTIONS}
            value={draft.classYear}
            onChangeAction={(classYear) => {
              update({ classYear });
            }}
          />
          <SurveyField
            icon="/unsorted-icons/events.svg"
            label="School year"
            helper="If you lived here more than once, pick the most recent"
            placeholder="Pick a school year"
            options={SCHOOL_YEAR_OPTIONS}
            value={draft.schoolYear}
            onChangeAction={(schoolYear) => {
              update({ schoolYear });
            }}
          />
        </div>
      </div>
    </>
  );
}

function RatingRow({
  icon,
  question,
  value,
  onChange,
}: {
  icon: string;
  question: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-start gap-[18px]">
      <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 flex-shrink-0" />
      <div className="flex flex-1 flex-col gap-3">
        <span className="text-[18px] font-medium leading-none">{question}</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-[14px]">
          <span className="hidden w-[52px] text-[18px] font-medium sm:inline">Poor</span>
          <div className="flex-1">
            <Slider
              min={1}
              max={5}
              showTicks
              value={value}
              onChange={onChange}
              ariaLabel={question}
            />
          </div>
          <span className="hidden w-[52px] text-right text-[18px] font-medium sm:inline">
            Great
          </span>
          <div className="flex justify-between text-[18px] font-medium sm:hidden">
            <span>Poor</span>
            <span>Great</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RatingsStep({ draft, update }: StepProps) {
  return (
    <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
      <h2 className="text-[24px] font-semibold leading-none">Rate your experience</h2>
      <div className="mt-8 flex flex-col gap-8">
        {RATING_QUESTIONS.map(({ key, icon, question }) => (
          <RatingRow
            key={key}
            icon={icon}
            question={question}
            value={draft.ratings[key]}
            onChange={(value) => {
              update({ ratings: { ...draft.ratings, [key]: value } });
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function WrittenStep({ building, draft, update }: StepProps) {
  return (
    <div className="flex flex-col rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
      <label htmlFor="review-body" className="text-[24px] font-semibold leading-none">
        Write your review
      </label>
      <p className="mt-3 text-[16px]">
        What was it like living in {building.name}? What should future residents know?
      </p>
      <textarea
        id="review-body"
        value={draft.body}
        maxLength={REVIEW_MAX_LENGTH}
        onChange={(event) => {
          update({ body: event.target.value });
        }}
        placeholder="The rooms, the people, the noise, the location..."
        className="mt-6 min-h-[220px] w-full flex-1 resize-y rounded-2xl border border-black/10 bg-white p-4 text-[18px] outline-none focus:border-brand-primary"
      />
      <p className="mt-2 text-right text-[14px] text-gray-600">
        {draft.body.length.toLocaleString()} / {REVIEW_MAX_LENGTH.toLocaleString()}
      </p>
    </div>
  );
}
