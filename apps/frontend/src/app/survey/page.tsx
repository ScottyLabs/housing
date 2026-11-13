import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@/api/client";
import StepFooter from "@/components/StepFooter";
import useFitToViewport from "@/hooks/useFitToViewport";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const TOTAL_STEPS = 3;

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

function SurveyStepContent({ step, data, update }: StepProps & { step: number }) {
  if (step === 1) return <RenderStep1 data={data} update={update} />;
  if (step === 2) return <RenderStep2 data={data} update={update} />;
  return <RenderStep3 data={data} update={update} />;
}

// On desktop every step sits in the same grid cell, so the page is always as tall as the tallest step. That keeps the scale-to-fit zoom and the footer in place when moving between steps.
// The last card stretches to fill any spare height. On mobile only the current step is rendered.
function SurveySteps({ step, data, update }: StepProps & { step: number }) {
  return (
    <div className="mt-6 md:grid">
      {Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1).map((n) => (
        <div
          key={n}
          className={`flex-col gap-6 md:col-start-1 md:row-start-1 md:flex md:[&>:last-child]:flex-1 ${n === step ? "flex" : "hidden md:invisible"}`}
        >
          <SurveyStepContent step={n} data={data} update={update} />
        </div>
      ))}
    </div>
  );
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

function nextLabel(step: number, isSubmitting: boolean): string {
  if (step < TOTAL_STEPS) return "Next";
  return isSubmitting ? "Submitting..." : "Submit survey";
}

export default function Survey() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, updateData } = useSurveyData();
  const navigate = useNavigate();
  const { ref, scale } = useFitToViewport();

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
    <div
      ref={ref}
      style={{ zoom: scale }}
      className="mx-auto w-full max-w-[1140px] px-6 pb-12 pt-[26px]"
    >
      <h1 className="text-[32px] font-bold leading-none">Survey</h1>
      <SurveySteps step={step} data={data} update={updateData} />
      <StepFooter
        step={step}
        totalSteps={TOTAL_STEPS}
        nextLabel={nextLabel(step, isSubmitting)}
        backLabel={step === 1 ? "Skip Survey" : "Back"}
        onNext={handleNext}
        onBack={() => {
          if (step === 1) navigate("/home");
          else setStep(step - 1);
        }}
        disabled={isSubmitting}
      />
    </div>
  );
}
