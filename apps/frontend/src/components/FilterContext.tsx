import { createContext, useContext, useMemo, useState } from "react";
import type { FilterState } from "@/data/buildingTypes";
import { defaultFilters } from "@/data/scoring";

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

const FilterContext = createContext<FilterContextType>({
  filters: defaultFilters,
  setFilters: () => {},
});

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const value = useMemo(() => ({ filters, setFilters }), [filters]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export const useFilters = () => useContext(FilterContext);
