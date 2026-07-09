import Checkbox from "@/components/Checkbox";
import Slider from "@/components/Slider";

const QUESTIONS = [
    { icon: "/unsorted-icons/stove.svg", question: "How often do you cook?" },
    { icon: "/unsorted-icons/gym.svg", question: "How often do you go to the gym?" },
    { icon: "/unsorted-icons/work%20with%20others.svg", question: "How often do you work productively around others?" },
    { icon: "/unsorted-icons/alone.svg", question: "How often do you need alone time?" },
    { icon: "/unsorted-icons/texting.svg", question: "How often do you make friend plans?" }
];

const GOALS = ["Exercise", "Cook", "Meet new people", "Study hard"];

function SliderRow({ icon, question }: { icon: string; question: string }) {
    return (
        <div className="flex items-start gap-[18px]">
            <img src={icon} alt="" aria-hidden="true" className="h-12 w-12 flex-shrink-0" />
            <div className="flex w-full max-w-[589px] flex-col gap-3">
                <span className="text-[18px] font-medium leading-none">{question}</span>
                <div className="flex items-center gap-[14px]">
                    <span className="whitespace-nowrap text-[18px] font-medium">Rarely</span>
                    <div className="flex-1">
                        <Slider min={1} max={5} showTicks />
                    </div>
                    <span className="whitespace-nowrap text-[18px] font-medium">Every day</span>
                </div>
            </div>
        </div>
    );
}

export default function Step2() {
    return (
        <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
            <div className="flex flex-col gap-8">
                {QUESTIONS.map((q) => (
                    <SliderRow key={q.question} icon={q.icon} question={q.question} />
                ))}
            </div>

            <div className="mt-10 flex flex-col gap-[18px]">
                <h2 className="text-[24px] font-semibold leading-none">Goals for this year</h2>
                {GOALS.map((goal) => (
                    <Checkbox key={goal} label={goal} />
                ))}
            </div>
        </div>
    );
}
