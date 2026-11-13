import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type Building, useBuildings } from "@/components/BuildingContext";
import StepFooter from "@/components/StepFooter";
import { stepProblem } from "@/data/reviews";
import useFitToViewport from "@/hooks/useFitToViewport";
import useSignInStatus from "@/hooks/useSignInStatus";
import { BuildingNotFound, ReviewPageHeader, ReviewPosted, SignInPrompt } from "./ReviewMessages";
import { RatingsStep, StayStep, type StepProps, WrittenStep } from "./ReviewSteps";
import { saveReview, useReviewDraft } from "./useReviewDraft";

const TOTAL_STEPS = 3;
const PAGE_CLASS = "mx-auto w-full max-w-[1140px] px-6 pb-12 pt-[26px]";

function StepContent({ step, ...props }: StepProps & { step: number }) {
  if (step === 1) return <StayStep {...props} />;
  if (step === 2) return <RatingsStep {...props} />;
  return <WrittenStep {...props} />;
}

function ReviewSteps({ step, ...props }: StepProps & { step: number }) {
  return (
    <div className="mt-6 md:grid">
      {Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1).map((n) => (
        <div
          key={n}
          className={`flex-col gap-6 md:col-start-1 md:row-start-1 md:flex md:[&>:last-child]:flex-1 ${n === step ? "flex" : "hidden md:invisible"}`}
        >
          <StepContent step={n} {...props} />
        </div>
      ))}
    </div>
  );
}

function nextLabel(step: number, isSaving: boolean, isEditing: boolean): string {
  if (step < TOTAL_STEPS) return "Next";
  if (isSaving) return "Posting...";
  return isEditing ? "Update review" : "Post review";
}

function useReviewFlow(building: Building, onSignedOut: () => void) {
  const [step, setStep] = useState(1);
  const [problem, setProblem] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const [posted, setPosted] = useState(false);
  const { draft, isEditing, update } = useReviewDraft(building.id);
  const navigate = useNavigate();

  const save = () => {
    setIsSaving(true);
    void saveReview(building.id, draft).then((result) => {
      setIsSaving(false);
      if (result === "saved") setPosted(true);
      else if (result === "signed-out") onSignedOut();
      else setProblem("We couldn't save your review. Please try again.");
    });
  };

  const next = () => {
    const nextProblem = stepProblem(step, draft);
    setProblem(nextProblem);
    if (nextProblem !== undefined) return;
    if (step < TOTAL_STEPS) setStep(step + 1);
    else save();
  };

  const back = () => {
    setProblem(undefined);
    if (step === 1) navigate("/reviews");
    else setStep(step - 1);
  };

  const edit = (fields: Parameters<typeof update>[0]) => {
    setProblem(undefined);
    update(fields);
  };

  return { back, draft, edit, isEditing, isSaving, next, posted, problem, step };
}

function ReviewForm({ building, onSignedOut }: { building: Building; onSignedOut: () => void }) {
  const flow = useReviewFlow(building, onSignedOut);
  const { ref, scale } = useFitToViewport();

  if (flow.posted) {
    return (
      <div className={PAGE_CLASS}>
        <ReviewPageHeader title={`Review ${building.name}`} />
        <ReviewPosted building={building} wasEdit={flow.isEditing} />
      </div>
    );
  }

  return (
    <div ref={ref} style={{ zoom: scale }} className={PAGE_CLASS}>
      <ReviewPageHeader
        title={flow.isEditing ? `Edit your ${building.name} review` : `Review ${building.name}`}
      />
      <ReviewSteps step={flow.step} building={building} draft={flow.draft} update={flow.edit} />
      {flow.problem !== undefined && (
        <p role="alert" className="mt-4 text-[16px] font-medium text-red-700">
          {flow.problem}
        </p>
      )}
      <StepFooter
        step={flow.step}
        totalSteps={TOTAL_STEPS}
        nextLabel={nextLabel(flow.step, flow.isSaving, flow.isEditing)}
        backLabel={flow.step === 1 ? "Cancel" : "Back"}
        onNext={flow.next}
        onBack={flow.back}
        disabled={flow.isSaving}
      />
    </div>
  );
}

export default function WriteReviewPage() {
  const { id } = useParams();
  const building = useBuildings().find((candidate) => candidate.id === id);
  const [status, setStatus] = useSignInStatus();
  const { pathname } = useLocation();

  if (!building) {
    return (
      <div className={PAGE_CLASS}>
        <ReviewPageHeader title="Write a Review" />
        <BuildingNotFound />
      </div>
    );
  }
  if (status === "signed-in") {
    return (
      <ReviewForm
        key={building.id}
        building={building}
        onSignedOut={() => {
          setStatus("signed-out");
        }}
      />
    );
  }
  return (
    <div className={PAGE_CLASS}>
      <ReviewPageHeader title={`Review ${building.name}`} />
      {status === "signed-out" && <SignInPrompt building={building} returnPath={pathname} />}
    </div>
  );
}
