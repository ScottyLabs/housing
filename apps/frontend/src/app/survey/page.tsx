import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@/api/client";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const TOTAL_STEPS = 3;

interface SurveyFooterProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

function FooterProgress({ step }: { step: number }) {
  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
  return (
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
  );
}

function FooterButtons({ step, onNext, onBack, onSkip, isSubmitting }: SurveyFooterProps) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="h-[56px] w-[204px] rounded-2xl bg-brand-primary text-[18px] font-medium text-white transition-colors hover:bg-[#f1872c] disabled:opacity-50"
      >
        {step === TOTAL_STEPS ? (isSubmitting ? "Submitting..." : "Submit survey") : "Next"}
      </button>
      <button
        type="button"
        onClick={step === 1 ? onSkip : onBack}
        disabled={isSubmitting}
        className="h-[56px] w-[204px] rounded-2xl bg-brand-buttongray font-['Inter'] text-[18px] font-medium text-black transition-colors hover:bg-[#d7dfe3] disabled:opacity-50"
      >
        {step === 1 ? "Skip Survey" : "Back"}
      </button>
    </div>
  );
}

function SurveyFooter(props: SurveyFooterProps) {
  return (
    <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <FooterProgress step={props.step} />
      <FooterButtons {...props} />
    </div>
  );
}

interface SurveyData {
  gender: string;
  year: string;
  major: string;
  cookingFrequency: number;
  gymFrequency: number;
  productiveAroundOthers: number;
  needsAloneTime: number;
  socialFrequency: number;
  goals: string[];
  accommodations: string[];
  preferredAmenities: string[];
}

const initialSurveyData: SurveyData = {
  gender: "",
  year: "",
  major: "",
  cookingFrequency: 3,
  gymFrequency: 3,
  productiveAroundOthers: 3,
  needsAloneTime: 3,
  socialFrequency: 3,
  goals: [],
  accommodations: [],
  preferredAmenities: [],
};

interface StepProps {
  data: SurveyData;
  update: (fields: Partial<SurveyData>) => void;
}

function RenderStep1({ data, update }: StepProps) {
  return (
    <Step1
      gender={data.gender}
      setGender={(val) => {
        update({ gender: val });
      }}
      year={data.year}
      setYear={(val) => {
        update({ year: val });
      }}
      major={data.major}
      setMajor={(val) => {
        update({ major: val });
      }}
    />
  );
}

function RenderStep2({ data, update }: StepProps) {
  return (
    <Step2
      cookingFrequency={data.cookingFrequency}
      setCookingFrequency={(val) => {
        update({ cookingFrequency: val });
      }}
      gymFrequency={data.gymFrequency}
      setGymFrequency={(val) => {
        update({ gymFrequency: val });
      }}
      productiveAroundOthers={data.productiveAroundOthers}
      setProductiveAroundOthers={(val) => {
        update({ productiveAroundOthers: val });
      }}
      needsAloneTime={data.needsAloneTime}
      setNeedsAloneTime={(val) => {
        update({ needsAloneTime: val });
      }}
      socialFrequency={data.socialFrequency}
      setSocialFrequency={(val) => {
        update({ socialFrequency: val });
      }}
      goals={data.goals}
      setGoals={(val) => {
        update({ goals: val });
      }}
    />
  );
}

function RenderStep3({ data, update }: StepProps) {
  return (
    <Step3
      accommodations={data.accommodations}
      setAccommodations={(val) => {
        update({ accommodations: val });
      }}
      preferredAmenities={data.preferredAmenities}
      setPreferredAmenities={(val) => {
        update({ preferredAmenities: val });
      }}
    />
  );
}

function SurveyStepContent({
  step,
  data,
  update,
}: {
  step: number;
  data: SurveyData;
  update: (fields: Partial<SurveyData>) => void;
}) {
  if (step === 1) return <RenderStep1 data={data} update={update} />;
  if (step === 2) return <RenderStep2 data={data} update={update} />;
  return <RenderStep3 data={data} update={update} />;
}

async function sendPreferences(data: SurveyData): Promise<boolean> {
  const { response } = await client.PUT("/api/me/preferences", {
    body: {
      accommodations: data.accommodations,
      cookingFrequency: data.cookingFrequency,
      goals: data.goals,
      gymFrequency: data.gymFrequency,
      major: data.major || null,
      needsAloneTime: data.needsAloneTime,
      preferredAmenities: data.preferredAmenities,
      preferredGenderHousing: data.gender || null,
      productiveAroundOthers: data.productiveAroundOthers,
      socialFrequency: data.socialFrequency,
      year: data.year || null,
    },
  });
  return response.ok;
}

function useSurveyData() {
  const [data, setData] = useState<SurveyData>(initialSurveyData);

  useEffect(() => {
    void client.GET("/api/me/preferences").then(({ data: prefs }) => {
      if (!prefs) return;
      setData({
        gender: prefs.preferredGenderHousing ?? "",
        year: prefs.year ?? "",
        major: prefs.major ?? "",
        cookingFrequency:
          prefs.cookingFrequency === null
            ? initialSurveyData.cookingFrequency
            : Number(prefs.cookingFrequency),
        gymFrequency:
          prefs.gymFrequency === null ? initialSurveyData.gymFrequency : Number(prefs.gymFrequency),
        productiveAroundOthers:
          prefs.productiveAroundOthers === null
            ? initialSurveyData.productiveAroundOthers
            : Number(prefs.productiveAroundOthers),
        needsAloneTime:
          prefs.needsAloneTime === null
            ? initialSurveyData.needsAloneTime
            : Number(prefs.needsAloneTime),
        socialFrequency:
          prefs.socialFrequency === null
            ? initialSurveyData.socialFrequency
            : Number(prefs.socialFrequency),
        goals: prefs.goals ?? [],
        accommodations: prefs.accommodations ?? [],
        preferredAmenities: prefs.preferredAmenities ?? [],
      });
    });
  }, []);

  const updateData = (fields: Partial<SurveyData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  return { data, updateData };
}

export default function Survey() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, updateData } = useSurveyData();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      void sendPreferences(data).finally(() => {
        setIsSubmitting(false);
        navigate("/home");
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1140px] px-6 pb-12 pt-[26px]">
      <h1 className="text-[32px] font-bold leading-none">Survey</h1>
      <div className="mt-6 flex flex-col gap-6">
        <SurveyStepContent step={step} data={data} update={updateData} />
      </div>
      <SurveyFooter
        step={step}
        onNext={handleNext}
        onBack={() => {
          if (step > 1) setStep(step - 1);
        }}
        onSkip={() => {
          navigate("/home");
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
