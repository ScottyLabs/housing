import { createContext, useContext, useMemo, useState } from "react";
import type { FilterState, HousingClass } from "@/data/buildingTypes";
import { defaultFilters } from "@/data/scoring";

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  housingChoice: HousingClass | null;
  setHousingChoice: (housingClass: HousingClass) => void;
}

const FilterContext = createContext<FilterContextType>({
  filters: defaultFilters,
  setFilters: () => {},
  housingChoice: null,
  setHousingChoice: () => {},
});

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [housingChoice, setHousingChoice] = useState<HousingClass | null>(null);
  const value = useMemo(
    () => ({ filters, setFilters, housingChoice, setHousingChoice }),
    [filters, housingChoice],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export const useFilters = () => useContext(FilterContext);
