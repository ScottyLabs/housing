import { useMemo } from "react";
import { useBuildings } from "@/components/BuildingContext";
import { HousingClass } from "@/data/buildingTypes";
import { buildingsForClass, housingClassForYear } from "@/data/housing";
import { preferencesToFilters } from "@/data/preferences";
import { rankBuildings } from "@/data/scoring";
import useFitToViewport from "@/hooks/useFitToViewport";
import usePreferences from "@/hooks/usePreferences";
import RecommendedBuildings from "./RecommendedBuildings";

export default function Home() {
  const buildings = useBuildings();
  const { loaded, preferences } = usePreferences();
  const { ref, scale } = useFitToViewport();
  const recommended = useMemo(() => {
    const housingClass = housingClassForYear(preferences?.year ?? null) ?? HousingClass.FirstYear;
    const inClass = buildingsForClass(buildings, housingClass);
    if (preferences === null) {
      return inClass.toSorted((b1, b2) => b1.name.localeCompare(b2.name)).slice(0, 5);
    }
    return rankBuildings(inClass, preferencesToFilters(preferences)).slice(0, 5);
  }, [buildings, preferences]);

  return (
    <div className="flex justify-center md:h-full px-4 md:px-0 mt-[26px]">
      <div
        ref={ref}
        style={{ zoom: scale }}
        className="flex flex-col w-full md:w-auto md:overflow-hidden"
      >
        <h1 className="hidden md:block font-bold text-[32px] py-3 flex-shrink-0">Home</h1>
        <div className="md:overflow-y-auto">
          <div className="flex flex-col gap-[16px] items-center sm:items-start pb-2">
            {loaded && <RecommendedBuildings buildings={recommended} />}
          </div>
        </div>
      </div>
    </div>
  );
}
