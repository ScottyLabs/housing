import { createContext, useContext } from "react";
import { buildings } from "@/data/buildings";
import { buildingTags } from "@/data/tags";
import type { Building, Tag } from "@/data/buildingTypes";

export type { Building, Tag };

interface BuildingContextType {
  buildings: Building[];
  tags: Tag[];
}

const BuildingContext = createContext<BuildingContextType>({
  buildings: [],
  tags: [],
});

export function BuildingProvider({ children }: { children: React.ReactNode }) {
  return (
    <BuildingContext.Provider value={{ buildings, tags: buildingTags }}>
      {children}
    </BuildingContext.Provider>
  );
}

export const useBuildings = () => useContext(BuildingContext).buildings;
export const useBuildingTagsMap = () =>
  new Map(useContext(BuildingContext).tags.map((tag) => [tag.id, tag]));

export function useBuildingById(id: string): Building {
  return useBuildings().find((b) => b.id === id)!;
}
