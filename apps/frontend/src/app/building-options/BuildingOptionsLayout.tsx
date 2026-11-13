import type { ReactNode } from "react";
import { useFilters } from "../../components/FilterContext.tsx";
import type { HousingClass } from "../../data/buildingTypes.ts";
import BuildingFilter from "./BuildingFilter.tsx";

// The filter sidebar stays beside the content on the overview and on each "See More" page.
export default function BuildingOptionsLayout({
  children,
  housingClass,
  onChangeHousingClassAction,
}: {
  children: ReactNode;
  housingClass: HousingClass;
  onChangeHousingClassAction: (housingClass: HousingClass) => void;
}) {
  const { filters, setFilters } = useFilters();

  return (
    <div className="flex flex-col md:flex-row md:h-full px-4 md:px-0 md:pl-[24px] mt-[26px]">
      <div className="flex-shrink-0">
        <BuildingFilter
          filters={filters}
          onChangeAction={setFilters}
          housingClass={housingClass}
          onChangeHousingClassAction={onChangeHousingClassAction}
        />
      </div>

      <div className="@container flex-1 flex flex-col px-0 md:px-5 md:overflow-hidden">
        {children}
      </div>
    </div>
  );
}
