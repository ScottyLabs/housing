import { useMemo } from "react";
import { useBuildings } from "../../components/BuildingContext.tsx";
import { useFilters } from "../../components/FilterContext.tsx";
import { type BuildingGroups, groupBuildings } from "../../data/scoring.ts";

// Shared by the overview and the "See More" pages so they rank with the same filters.
export default function useBuildingGroups(): BuildingGroups {
  const buildings = useBuildings();
  const { filters } = useFilters();
  return useMemo(() => groupBuildings(buildings, filters), [buildings, filters]);
}
