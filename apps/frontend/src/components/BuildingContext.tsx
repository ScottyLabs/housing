import { createContext, useContext, useMemo } from "react";
import { buildingTags } from "@/data/tags";
import type { Building, CampusBuilding, Tag } from "@/data/buildingTypes";
import useBuildingData, { type BuildingData } from "@/hooks/useBuildingData";

export type { Building, Tag };

interface BuildingContextType {
  buildings: Building[];
  campusBuildings: CampusBuilding[];
  reload: () => void;
  status: BuildingData["status"];
  tags: Tag[];
}

const noBuildings: Building[] = [];
const noCampusBuildings: CampusBuilding[] = [];

const BuildingContext = createContext<BuildingContextType>({
  buildings: noBuildings,
  campusBuildings: noCampusBuildings,
  reload: () => undefined,
  status: "loading",
  tags: [],
});

export function BuildingProvider({ children }: { children: React.ReactNode }) {
  const { data, reload } = useBuildingData();
  const value = useMemo(
    () => ({
      buildings: data.status === "loaded" ? data.buildings : noBuildings,
      campusBuildings: data.status === "loaded" ? data.campusBuildings : noCampusBuildings,
      reload,
      status: data.status,
      tags: buildingTags,
    }),
    [data, reload],
  );

  return <BuildingContext.Provider value={value}>{children}</BuildingContext.Provider>;
}

export const useBuildings = () => useContext(BuildingContext).buildings;
export const useCampusBuildings = () => useContext(BuildingContext).campusBuildings;
export const useBuildingStatus = () => useContext(BuildingContext).status;
export const useReloadBuildings = () => useContext(BuildingContext).reload;
export const useBuildingTagsMap = () =>
  new Map(useContext(BuildingContext).tags.map((tag) => [tag.id, tag]));

export function useBuildingById(id: string): Building {
  return useBuildings().find((b) => b.id === id)!;
}
