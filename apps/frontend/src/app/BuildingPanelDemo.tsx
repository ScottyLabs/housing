import { useBuildingById } from "@/components/BuildingContext";
import BuildingOption from "@/components/BuildingOption";
import { Link } from "react-router-dom";

export default function BuildingPanelDemo() {
  const recommended_buildings = [
    useBuildingById("stever"),
    useBuildingById("morewood"),
    useBuildingById("mudge"),
    useBuildingById("etower"),
    useBuildingById("donner"),
  ];

  return (
    <div className="space-y-4 overflow-x-auto min-w-[300px] max-w-full pb-3">
      <div className="flex gap-[12px] items-center">
        <h2 className="font-semibold text-[24px]">Recommended Buildings</h2>
      </div>
      <div className="flex gap-[12px] ">
        {recommended_buildings.slice(0, 3).map((b) => (
          <BuildingOption
            key={b.id}
            building={b}
            className="shrink-0 w-[240px] h-[320px] md:w-[419.79px] md:h-[286.33px]"
          />
        ))}
      </div>
      <div className="flex gap-[12px] ">
        {recommended_buildings.slice(3, 5).map((b) => (
          <BuildingOption
            key={b.id}
            building={b}
            className="shrink-0 w-[240px] h-[320px] md:w-[419.79px] md:h-[286.33px]"
          />
        ))}
        <Link
          to="/building-options"
          className="flex flex-col items-center rounded-lg bg-brand-menugray justify-center border border-black/10 transition-colors duration-200 hover:bg-gray-200 cursor-pointer shrink-0 w-[240px] h-[320px] md:w-[419.79px] md:h-[286.33px]"
        >
          <img src="/all-buildings-colored.svg" alt="all buildings" className="w-[48px] h-[48px]" />
          <div className="font-semibold text-black text-[24px] w-full text-center ">
            See all Buildings
          </div>
        </Link>
      </div>
    </div>
  );
}
