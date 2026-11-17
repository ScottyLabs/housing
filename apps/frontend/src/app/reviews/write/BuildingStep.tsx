import { BUILDING_QUESTIONS } from "@/data/reviews";
import { RatingsCard, type StepProps } from "./ReviewSteps";

export function BuildingStep({ draft, update }: StepProps) {
  return (
    <RatingsCard
      title="Rate the building"
      questions={BUILDING_QUESTIONS}
      draft={draft}
      update={update}
    />
  );
}
