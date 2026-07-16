import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const TOTAL_STEPS = 3;

function SurveyFooter({
    step,
    onNext,
    onBack,
    onSkip
}: {
    step: number;
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
}) {
    const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

    return (
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-[14px]">
                <span className="whitespace-nowrap text-[18px] font-medium">
                    Part {step} of {TOTAL_STEPS}
                </span>
                <div className="relative h-[4px] flex-1 rounded-full bg-[#DADEE0]">
                    <div
                        className="absolute left-0 top-0 h-full rounded-full bg-brand-primary transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onNext}
                    className="h-[56px] w-[204px] rounded-2xl bg-brand-primary text-[18px] font-medium text-white transition-colors hover:bg-[#f1872c]">
                    {step === TOTAL_STEPS ? "Submit survey" : "Next"}
                </button>
                <button
                    type="button"
                    onClick={step === 1 ? onSkip : onBack}
                    className="h-[56px] w-[204px] rounded-2xl bg-brand-buttongray font-['Inter'] text-[18px] font-medium text-black transition-colors hover:bg-[#d7dfe3]">
                    {step === 1 ? "Skip Survey" : "Back"}
                </button>
            </div>
        </div>
    );
}

export default function Survey() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      navigate("/home");
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const skip = () => navigate("/home");

  return (
    <div className="mx-auto w-full max-w-[1140px] px-6 pb-12 pt-[26px]">
      <h1 className="text-[32px] font-bold leading-none">Survey</h1>

      <div className="mt-6 flex flex-col gap-6">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
      </div>

      <SurveyFooter step={step} onNext={goNext} onBack={goBack} onSkip={skip} />
    </div>
  );
}
