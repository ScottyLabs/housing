import { useState } from "react";
import { Building, useBuildings } from "@/components/BuildingContext";
import BuildingColumn from "@/components/BuildingComparison";

const MAX_BUILDINGS = 4;

export default function Home() {
  const buildings: Building[] = useBuildings();
  const [ids, setIds] = useState<string[]>(() => buildings.slice(0, 2).map((b) => b.id));

  const getBuilding = (id: string) => buildings.find((b) => b.id === id);

  const handleChange = (index: number) => (id: string) => {
    setIds((prev) => prev.map((cur, i) => (i === index ? id : cur)));
  };

  const addColumn = () => {
    const next = buildings.find((b) => !ids.includes(b.id));
    if (next) setIds((prev) => [...prev, next.id]);
  };

  return (
    <div className="px-[15px] pb-[24px] pt-[15px] overflow-x-auto">
      <div
        className="grid gap-x-4 gap-y-2 justify-center min-w-full w-max mx-auto"
        style={{
          gridAutoFlow: "column",
          gridTemplateRows: "repeat(7, auto)",
          gridAutoColumns: "280px",
        }}
      >
        {ids.map((id, i) => {
          const b = getBuilding(id);
          return (
            b && <BuildingColumn key={`${id}-${i}`} building={b} onChangeAction={handleChange(i)} />
          );
        })}

        {ids.length < MAX_BUILDINGS && (
          <button
            onClick={addColumn}
            style={{ gridRow: "1 / 3" }}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/20"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary text-white text-2xl">
              <img src="/public/orange-plus.svg" alt="Add" className="w-10 h-10 object-contain" />
            </span>
            <span className="font-semibold text-[16px]">Add Building</span>
          </button>
        )}
      </div>
    </div>
  );
}
