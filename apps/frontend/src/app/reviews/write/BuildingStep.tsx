import { useState } from "react";
import { DEFAULT_RATING } from "@/data/reviews";
import { RatingRow } from "./ReviewSteps";

type SpaceKey = "rooms" | "bathrooms" | "commonSpaces";

const SPACES: Array<{ key: SpaceKey; icon: string; question: string }> = [
  {
    key: "rooms",
    icon: "/unsorted-icons/room-type/trad-single.svg",
    question: "Room Quality (size, condition)",
  },
  {
    key: "bathrooms",
    icon: "/unsorted-icons/showerhead.svg",
    question: "Bathroom Quality (cleanliness, condition)",
  },
  {
    key: "commonSpaces",
    icon: "/unsorted-icons/lounge.svg",
    question: "Common Space Quality (lounges, study rooms, game rooms)",
  },
];

type SpaceRatings = Record<SpaceKey, number>;

const INITIAL_RATINGS: SpaceRatings = {
  rooms: DEFAULT_RATING,
  bathrooms: DEFAULT_RATING,
  commonSpaces: DEFAULT_RATING,
};

export function BuildingStep() {
  const [ratings, setRatings] = useState(INITIAL_RATINGS);

  const change = (key: SpaceKey, value: number) => {
    setRatings((previous) => ({ ...previous, [key]: value }));
  };

  return (
    <div className="rounded-[18px] border border-black/10 bg-brand-menugray px-8 py-8">
      <h2 className="text-[24px] font-semibold leading-none">Rate the building</h2>
      <div className="mt-8 flex flex-col gap-8">
        {SPACES.map(({ key, icon, question }) => (
          <RatingRow
            key={key}
            icon={icon}
            question={question}
            low="Poor"
            high="Great"
            value={ratings[key]}
            onChange={(value) => {
              change(key, value);
            }}
          />
        ))}
      </div>
    </div>
  );
}
