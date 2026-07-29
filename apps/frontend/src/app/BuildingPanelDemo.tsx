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
    <div className="space-y-4 pb-3">
      <div className="flex gap-[12px] items-center">
        <h2 className="font-semibold text-[24px]">Recommended Buildings</h2>
      </div>
      <div className="grid grid-cols-2 gap-[12px] md:grid-cols-[repeat(3,419.79px)]">
        {recommended_buildings.map((b) => (
          <BuildingOption
            key={b.id}
            building={b}
            className="w-full aspect-[3/4] md:aspect-[419.79/286.33]"
          />
        ))}
        <Link
          to="/building-options"
          className="flex flex-col items-center justify-center rounded-lg bg-brand-menugray border border-black/10 transition-colors duration-200 hover:bg-gray-200 cursor-pointer w-full aspect-[3/4] md:aspect-[419.79/286.33]"
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
