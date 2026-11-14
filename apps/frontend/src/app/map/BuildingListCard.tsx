import TravelTimes from "./TravelTimes";
import type { HousingEntry } from "./places";

export default function BuildingListCard({
  entry,
  selected,
  onSelect,
}: {
  entry: HousingEntry;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const { building, travel } = entry;
  const tone = selected
    ? "border-brand-primary bg-brand-primary text-white"
    : "border-black/10 bg-brand-menugray hover:bg-brand-buttongray";
  const chipTone = selected ? "bg-white text-black" : "bg-[#0c8987] text-white";

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => {
        onSelect(building.id);
      }}
      className={`flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-3 text-left transition-colors ${tone}`}
    >
      <img
        src={building.media.mainImage}
        alt=""
        loading="lazy"
        className="h-[84px] w-[112px] shrink-0 rounded-xl object-cover"
      />
      <span className="flex min-w-0 flex-col gap-2">
        <span className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${chipTone}`}>
            {building.code}
          </span>
          <span className="truncate text-[20px] font-semibold">{building.name}</span>
        </span>
        <TravelTimes travel={travel} />
      </span>
    </button>
  );
}
