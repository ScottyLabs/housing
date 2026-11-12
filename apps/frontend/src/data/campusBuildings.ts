import campusBuildingsData from "./campusBuildings.json" with { type: "json" };
import type { CampusBuilding } from "./buildingTypes";

export const campusBuildings = campusBuildingsData as CampusBuilding[];
