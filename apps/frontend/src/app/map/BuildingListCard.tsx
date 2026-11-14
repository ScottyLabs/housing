import TravelTimes from "./TravelTimes";
import type { HousingEntry } from "./places";

function CardContent({ entry, selected }: { entry: HousingEntry; selected: boolean }) {
  const { building, travel } = entry;
  const chipTone = selected ? "bg-white text-black" : "bg-[#0c8987] text-white";

  return (
    <>
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
    </>
  );
}

export default function BuildingListCard({
  entry,
  selected,
  onSelect,
  onOpen,
}: {
  entry: HousingEntry;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const id = entry.building.id;
  const tone = selected
    ? "border-brand-primary bg-brand-primary text-white"
    : "border-black/10 bg-brand-menugray hover:bg-brand-buttongray";

  return (
    <button
      type="button"
      aria-pressed={selected}
      title="Double-click to view details"
      onClick={() => {
        onSelect(id);
      }}
      onDoubleClick={() => {
        onOpen(id);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && selected) onOpen(id);
      }}
      className={`flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-3 text-left transition-colors ${tone}`}
    >
      <CardContent entry={entry} selected={selected} />
    </button>
  );
}
