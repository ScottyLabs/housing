import { useEffect, useMemo, useState } from "react";
import client from "@/api/client";
import { useBuildings } from "@/components/BuildingContext";
import { type Preferences, preferencesToFilters } from "@/data/preferences";
import { rankBuildings } from "@/data/scoring";
import RecommendedBuildings from "./RecommendedBuildings";
import { GenderHousing } from "@/data/buildingTypes";

function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    void client.GET("/api/me/preferences").then(({ data }) => {
      if (data) setPreferences(data);
    });
  }, []);

  return preferences;
}

export default function Home() {
  const buildings = useBuildings();
  const preferences = usePreferences();

  const recommended = useMemo(() => {
    if (preferences === null) {
      // Copy the shared building list before sorting it.
      // oxlint-disable-next-line unicorn/no-array-sort
      return [...buildings].sort((b1, b2) => b1.name.localeCompare(b2.name)).slice(0, 5);
    }
    const filters = preferencesToFilters(preferences);
    const eligible = buildings.filter(
      (building) =>
        filters.genderHousing === null ||
        building.amenities.genderHousing === GenderHousing.CoEd ||
        building.amenities.genderHousing === filters.genderHousing,
    );
    return rankBuildings(eligible, filters).slice(0, 5);
  }, [buildings, preferences]);

  return (
    <div className="flex justify-center md:h-full px-4 md:px-0 mt-[26px]">
      <div className="flex flex-col w-full md:w-auto md:overflow-hidden">
        <h1 className="hidden md:block font-bold text-[32px] py-3 flex-shrink-0">Home</h1>
        <div className="md:overflow-y-auto">
          <div className="flex flex-col gap-[16px] items-center sm:items-start pb-2">
            <RecommendedBuildings buildings={recommended} />
          </div>
        </div>
      </div>
    </div>
  );
}
