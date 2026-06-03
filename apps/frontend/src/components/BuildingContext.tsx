import { createContext, useContext } from "react";
import { buildings } from "@/data/buildings";
import { buildingTags } from "@/data/tags";

export interface Building {
    id: string;
    name: string;
    image: string;
    photoGallery: BuildingImage[];
    tags: string[];
    rooms: string[];
    bathrooms: BathroomInfo;
    closeBuildings: string;
    AC: ACInfo;
    kitchen: string;
    lounge: string;
}
export interface Tag {
    id: string;
    label: string;
    icon: string;
}

type BathroomInfo = {
    type: string;
    details: string;
};
type ACInfo = {
    available: boolean;
    details: string;
};
type BuildingImage = {
    link: string;
    description: string;
};
interface BuildingContextType {
    buildings: Building[];
    tags: Tag[];
}

const BuildingContext = createContext<BuildingContextType>({
    buildings: [],
    tags: []
});

export function BuildingProvider({ children }: { children: React.ReactNode }) {
    return <BuildingContext.Provider value={{ buildings, tags: buildingTags }}>{children}</BuildingContext.Provider>;
}

export const useBuildings = () => useContext(BuildingContext).buildings;
export const useBuildingTagsMap = () => new Map(useContext(BuildingContext).tags.map((tag) => [tag.id, tag]));

// Requires that id is a valid building id
export function useBuildingById(id: string): Building {
    return useBuildings().find((b) => b.id === id)!;
}
