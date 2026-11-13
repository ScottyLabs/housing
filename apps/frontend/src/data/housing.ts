import { type Building, HousingClass } from "./buildingTypes.ts";

export const housingClasses: HousingClass[] = [HousingClass.FirstYear, HousingClass.Upperclass];

export const housingClassLabel: Record<HousingClass, string> = {
  [HousingClass.FirstYear]: "First Year",
  [HousingClass.Upperclass]: "Upperclass",
};

const UPPERCLASS_YEARS = new Set(["sophomore", "junior", "senior"]);

export function housingClassForYear(year: string | null): HousingClass | null {
  if (year === "first-year") return HousingClass.FirstYear;
  if (year !== null && UPPERCLASS_YEARS.has(year)) return HousingClass.Upperclass;
  return null;
}

export function buildingsForClass(buildings: Building[], housingClass: HousingClass): Building[] {
  return buildings.filter((building) => building.housingClasses.includes(housingClass));
}
