/** The "Part 1 of 3" progress bar and Next/Back buttons under the survey and the review form. */

export interface StepFooterProps {
  step: number;
  totalSteps: number;
  nextLabel: string;
  backLabel: string;
  onNext: () => void;
  onBack: () => void;
  disabled?: boolean;
}

function FooterProgress({ step, totalSteps }: { step: number; totalSteps: number }) {
  const progress = ((step - 1) / (totalSteps - 1)) * 100;
  return (
    <div className="flex flex-1 items-center gap-[14px]">
      <span className="whitespace-nowrap text-[18px] font-medium">
        Part {step} of {totalSteps}
      </span>
      <div className="relative h-[4px] flex-1 rounded-full bg-[#DADEE0]">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-brand-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function FooterButtons({ nextLabel, backLabel, onNext, onBack, disabled }: StepFooterProps) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="h-[56px] w-[204px] rounded-2xl bg-brand-primary text-[18px] font-medium text-white transition-colors hover:bg-[#f1872c] disabled:opacity-50"
      >
        {nextLabel}
      </button>
      <button
        type="button"
        onClick={onBack}
        disabled={disabled}
        className="h-[56px] w-[204px] rounded-2xl bg-brand-buttongray font-['Inter'] text-[18px] font-medium text-black transition-colors hover:bg-[#d7dfe3] disabled:opacity-50"
      >
        {backLabel}
      </button>
    </div>
  );
}

export default function StepFooter(props: StepFooterProps) {
  return (
    <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <FooterProgress step={props.step} totalSteps={props.totalSteps} />
      <FooterButtons {...props} />
    </div>
  );
}
