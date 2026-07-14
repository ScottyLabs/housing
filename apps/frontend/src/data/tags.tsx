import { ACLevel, type Building, GenderHousing, KitchenScope, LaundryLocation, type Tag } from "./buildingTypes";

export const buildingTags: Tag[] = [
    { id: "noKitchen", label: "No kitchen on every floor", icon: "/building-tags/stove.svg" },
    { id: "limitedAC", label: "Limited AC", icon: "/building-tags/acWindow.svg" },
    { id: "basementLaundry", label: "Basement laundry", icon: "/building-tags/washer.svg" },
    { id: "noCentralAC", label: "No central AC", icon: "/building-tags/acWindow.svg" },
    { id: "gymAccess", label: "Gym access", icon: "/building-tags/gym.svg" },
    { id: "girlsOnly", label: "Girls only", icon: "/building-tags/girlsOnly.svg" },
    { id: "lgbtqInclusive", label: "LGBTQ+ inclusive", icon: "/building-tags/workWithOthers.svg" }
];

export function deriveTags(b: Building): string[] {
    const t: string[] = [];
    if (b.amenities.kitchen.scope === KitchenScope.None) t.push("noKitchen");
    if (b.amenities.ac.level === ACLevel.ByNecessity) t.push("limitedAC");
    if (b.amenities.ac.level !== ACLevel.None && b.amenities.ac.level !== ACLevel.Central) t.push("noCentralAC");
    if (b.amenities.laundry.location === LaundryLocation.Basement) t.push("basementLaundry");
    if (b.amenities.gym.available) t.push("gymAccess");
    if (b.amenities.genderHousing === GenderHousing.WomenOnly) t.push("girlsOnly");
    if (b.amenities.genderHousing === GenderHousing.GenderInclusive) t.push("lgbtqInclusive");
    return [...t, ...(b.editorialTags ?? [])];
}
