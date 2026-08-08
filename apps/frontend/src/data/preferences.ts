import { type FilterState, GenderHousing } from "./buildingTypes";
import { defaultFilters } from "./scoring";

export interface Preferences {
  accommodations: string[] | null;
  preferredAmenities: string[] | null;
  preferredGenderHousing: string | null;
  socialFrequency: string | number | null;
}

const genderHousingByAnswer: Record<string, GenderHousing> = {
  female: GenderHousing.WomenOnly,
  male: GenderHousing.MenOnly,
  "nb-female": GenderHousing.WomenOnly,
  "nb-male": GenderHousing.MenOnly,
  "nb-inclusive": GenderHousing.GenderInclusive,
};

function toGenderHousing(gender: string | null): GenderHousing | null {
  if (gender === null) return null;
  return genderHousingByAnswer[gender] ?? null;
}

export function preferencesToFilters(prefs: Preferences): FilterState {
  const wanted = [...(prefs.accommodations ?? []), ...(prefs.preferredAmenities ?? [])];

  return {
    ...defaultFilters,
    serviceAnimal: wanted.includes("Service Animal"),
    wheelchairAccessible: wanted.includes("Wheelchair accessible"),
    singleRoom: wanted.includes("Single room"),
    airConditioning:
      wanted.includes("Air conditioning") || wanted.includes("Climate control: AC"),
    enSuiteBathroom: wanted.includes("En suite bathroom"),
    socialness: prefs.socialFrequency === null ? null : Number(prefs.socialFrequency),
    genderHousing: toGenderHousing(prefs.preferredGenderHousing),
  };
}
