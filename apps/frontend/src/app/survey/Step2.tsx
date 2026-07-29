import Checkbox from "@/components/Checkbox";
import Slider from "@/components/Slider";

export interface Step2Props {
  cookingFrequency: number;
  setCookingFrequency: (val: number) => void;
  gymFrequency: number;
  setGymFrequency: (val: number) => void;
  productiveAroundOthers: number;
  setProductiveAroundOthers: (val: number) => void;
  needsAloneTime: number;
  setNeedsAloneTime: (val: number) => void;
  socialFrequency: number;
  setSocialFrequency: (val: number) => void;
  goals: string[];
  setGoals: (val: string[]) => void;
}

const QUESTIONS: Array<{
  key:
    | "cookingFrequency"
    | "gymFrequency"
    | "productiveAroundOthers"
    | "needsAloneTime"
    | "socialFrequency";
  icon: string;
  question: string;
}> = [
  {
    key: "cookingFrequency",
    icon: "/unsorted-icons/stove.svg",
    question: "How often do you cook?",
  },
  {
    key: "gymFrequency",
    icon: "/unsorted-icons/gym.svg",
    question: "How often do you go to the gym?",
  },
  {
    key: "productiveAroundOthers",
    icon: "/unsorted-icons/work-with-others.svg",
    question: "How often do you work productively around others?",
  },
  {
    key: "needsAloneTime",
    icon: "/unsorted-icons/alone.svg",
    question: "How often do you need alone time?",
  },
  {
    key: "socialFrequency",
    icon: "/unsorted-icons/texting.svg",
    question: "How often do you make friend plans?",
  },
];

const GOALS = ["Exercise", "Cook", "Meet new people", "Study hard"];

function SliderRow({
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
          <span className="hidden whitespace-nowrap text-[18px] font-medium sm:inline">Rarely</span>
          <div className="flex-1">
            <Slider min={1} max={5} showTicks value={value} onChange={onChange} />
          </div>
          <span className="hidden whitespace-nowrap text-[18px] font-medium sm:inline">
            Every day
          </span>
          <div className="flex justify-between text-[18px] font-medium sm:hidden">
            <span>Rarely</span>
            <span>Every day</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderList(props: Step2Props) {
  const getSliderState = (key: (typeof QUESTIONS)[number]["key"]) => {
    if (key === "cookingFrequency")
      return { value: props.cookingFrequency, onChange: props.setCookingFrequency };
    if (key === "gymFrequency")
      return { value: props.gymFrequency, onChange: props.setGymFrequency };
    if (key === "productiveAroundOthers")
      return { value: props.productiveAroundOthers, onChange: props.setProductiveAroundOthers };
    if (key === "needsAloneTime")
      return { value: props.needsAloneTime, onChange: props.setNeedsAloneTime };
    return { value: props.socialFrequency, onChange: props.setSocialFrequency };
  };

  return (
    <div className="flex flex-col gap-8">
      {QUESTIONS.map((q) => {
        const { value, onChange } = getSliderState(q.key);
        return (
          <SliderRow
            key={q.question}
            icon={q.icon}
            question={q.question}
            value={value}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
}

function GoalsList({ goals, setGoals }: { goals: string[]; setGoals: (val: string[]) => void }) {
  const toggleGoal = (goal: string, checked: boolean) => {
    if (checked) {
      setGoals([...goals, goal]);
    } else {
      setGoals(goals.filter((g) => g !== goal));
    }
  };

  return (
    <div className="mt-10 flex flex-col gap-[18px]">
      <h2 className="text-[24px] font-semibold leading-none">Goals for this year</h2>
      {GOALS.map((goal) => (
        <Checkbox
          key={goal}
          label={goal}
          checked={goals.includes(goal)}
          onChange={(checked) => {
            toggleGoal(goal, checked);
          }}
        />
      ))}
    </div>
  );
}

export default function Step2(props: Step2Props) {
  return (
    <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
      <SliderList {...props} />
      <GoalsList goals={props.goals} setGoals={props.setGoals} />
    </div>
  );
}
