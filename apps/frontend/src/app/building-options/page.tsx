import { useMemo, useState } from "react";
import { useBuildings } from "@/components/BuildingContext";
import type { FilterState } from "@/data/buildingTypes";
import { defaultFilters, groupBuildings } from "@/data/scoring";
import BuildingFilter from "./BuildingFilter";
import BuildingOptionRow from "./BuildingOptionRow";

export default function Home() {
  const buildings = useBuildings();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const { bestFit, decentFit, wildCard } = useMemo(
    () => groupBuildings(buildings, filters),
    [buildings, filters],
  );

  return (
    <div className="flex flex-col md:flex-row md:h-full px-4 md:px-0 md:pl-[24px] mt-[26px]">
      <div className="flex-shrink-0">
        <BuildingFilter filters={filters} onChangeAction={setFilters} />
      </div>

      <div className="flex-1 flex flex-col px-0 md:px-5 md:overflow-hidden">
        <h1 className="hidden md:block font-bold text-[24px] md:text-[32px] pt-[15px] pb-[28px] flex-shrink-0">
          All Building Options
        </h1>
        <div className="flex-1 md:overflow-y-auto pb-[60px]">
          <div className="flex flex-col gap-[36px] items-center sm:items-start">
            <BuildingOptionRow
              title="Best Fit for You"
              icon="/sparkle.svg"
              icon_alt="sparkle"
              buildings={bestFit}
              see_more={false}
            />
            <BuildingOptionRow
              title="Decent Fit"
              icon="/slight-smile.svg"
              icon_alt="slight smile"
              buildings={decentFit}
              see_more={true}
            />
            <BuildingOptionRow
              title="Wild Card"
              icon="/wildcard.svg"
              icon_alt="wild card"
              buildings={wildCard}
              see_more={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
