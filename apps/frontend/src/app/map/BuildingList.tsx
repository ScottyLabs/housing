import { useEffect, useRef } from "react";
import BuildingListCard from "./BuildingListCard";
import type { HousingEntry } from "./places";

export default function BuildingList({
  entries,
  selectedId,
  onSelect,
  onOpen,
}: {
  entries: HousingEntry[];
  selectedId: string;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list === null) return;
    const card = list.querySelector<HTMLElement>(`[data-building-id="${selectedId}"]`);
    if (card === null) return;
    list.scrollTo({ top: card.offsetTop, behavior: "smooth" });
  }, [selectedId]);

  if (entries.length === 0) {
    return <p className="text-[14px] text-gray-600">No buildings match your search.</p>;
  }

  return (
    <ul ref={listRef} className="relative flex flex-col gap-3 md:h-full md:overflow-y-auto md:pr-1">
      {entries.map((entry) => (
        <li key={entry.building.id} data-building-id={entry.building.id}>
          <BuildingListCard
            entry={entry}
            selected={entry.building.id === selectedId}
            onSelect={onSelect}
            onOpen={onOpen}
          />
        </li>
      ))}
    </ul>
  );
}
