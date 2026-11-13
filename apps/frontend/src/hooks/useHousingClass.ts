import { useFilters } from "@/components/FilterContext";
import { HousingClass } from "@/data/buildingTypes";
import { housingClassForYear } from "@/data/housing";
import type { PreferencesState } from "./usePreferences";

export interface HousingSelection {
  housingClass: HousingClass;
  setHousingClass: (housingClass: HousingClass) => void;
  ready: boolean;
}

export default function useHousingClass({
  loaded,
  preferences,
}: PreferencesState): HousingSelection {
  const { housingChoice, setHousingChoice } = useFilters();
  const fromYear = housingClassForYear(preferences?.year ?? null);

  // Not ready until the survey year is known, so an upperclassman never sees first-year buildings flash by.
  return {
    housingClass: housingChoice ?? fromYear ?? HousingClass.FirstYear,
    setHousingClass: setHousingChoice,
    ready: housingChoice !== null || loaded,
  };
}
