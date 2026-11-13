import { useMemo } from "react";
import { useBuildings } from "../../components/BuildingContext.tsx";
import { useFilters } from "../../components/FilterContext.tsx";
import { buildingsForClass } from "../../data/housing.ts";
import { type BuildingGroups, groupBuildings } from "../../data/scoring.ts";
import useHousingClass, { type HousingSelection } from "../../hooks/useHousingClass.ts";
import usePreferences from "../../hooks/usePreferences.ts";

// Shared by the overview and the "See More" pages so they rank with the same filters.
export default function useBuildingGroups(): HousingSelection & { groups: BuildingGroups } {
  const buildings = useBuildings();
  const { filters } = useFilters();
  const selection = useHousingClass(usePreferences());
  const { housingClass, ready } = selection;
  const groups = useMemo(
    () => groupBuildings(ready ? buildingsForClass(buildings, housingClass) : [], filters),
    [buildings, filters, housingClass, ready],
  );

  return { ...selection, groups };
}
