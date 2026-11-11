import type { ReactNode } from "react";
import { useFilters } from "../../components/FilterContext.tsx";
import BuildingFilter from "./BuildingFilter.tsx";

// The filter sidebar stays beside the content on the overview and on each "See More" page.
export default function BuildingOptionsLayout({ children }: { children: ReactNode }) {
  const { filters, setFilters } = useFilters();

  return (
    <div className="flex flex-col md:flex-row md:h-full px-4 md:px-0 md:pl-[24px] mt-[26px]">
      <div className="flex-shrink-0">
        <BuildingFilter filters={filters} onChangeAction={setFilters} />
      </div>

      <div className="@container flex-1 flex flex-col px-0 md:px-5 md:overflow-hidden">
        {children}
      </div>
    </div>
  );
}
