import type { Building } from "../../components/BuildingContext.tsx";
import type { BuildingGroups } from "../../data/scoring.ts";

/** How many buildings a category row previews before its "See More" tile. */
export const PREVIEW_COUNT = 3;

export interface BuildingCategory {
  /** Identifies the category in the URL of its "See More" page. */
  slug: string;
  title: string;
  icon: string;
  iconAlt: string;
  /** Whether the row links to a page listing every building in the category. */
  seeMore: boolean;
  /** The category's buildings, already in the order of the user's preferences. */
  pick: (groups: BuildingGroups) => Building[];
}

export const buildingCategories: BuildingCategory[] = [
  {
    slug: "best-fit",
    title: "Best Fit for You",
    icon: "/sparkle.svg",
    iconAlt: "sparkle",
    seeMore: false,
    pick: (groups) => groups.bestFit,
  },
  {
    slug: "decent-fit",
    title: "Decent Fit",
    icon: "/slight-smile.svg",
    iconAlt: "slight smile",
    seeMore: true,
    pick: (groups) => groups.decentFit,
  },
  {
    slug: "wild-card",
    title: "Wild Card",
    icon: "/wildcard.svg",
    iconAlt: "wild card",
    seeMore: true,
    pick: (groups) => groups.wildCard,
  },
];
