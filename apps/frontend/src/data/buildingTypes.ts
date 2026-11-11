export enum RoomType {
  TradSingle = "trad_single",
  TradDouble = "trad_double",
  TradTriple = "trad_triple",
  SemiSuiteSingle = "semi_suite_single",
  SemiSuiteDouble = "semi_suite_double",
  SemiSuiteTriple = "semi_suite_triple",
  SemiSuiteQuad = "semi_suite_quad",
  ApartmentTriple = "apartment_triple",
  StudioApartmentSingle = "studio_apartment_single",
  StudioApartmentDouble = "studio_apartment_double",
}

export enum BathroomType {
  Communal = "communal",
  SharedSuite = "shared_suite",
  Private = "private",
}

export enum ACLevel {
  None = "none",
  ByNecessity = "by_necessity",
  Window = "window",
  Central = "central",
}

export enum LaundryLocation {
  None = "none",
  Basement = "basement",
  EachFloor = "each_floor",
  InUnit = "in_unit",
}

export enum KitchenScope {
  None = "none",
  Shared = "shared",
  InUnit = "in_unit",
}

export enum GenderHousing {
  CoEd = "co_ed",
  WomenOnly = "women_only",
  MenOnly = "men_only",
  GenderInclusive = "gender_inclusive",
}

export interface Bathrooms {
  types: BathroomType[];
  details?: string;
}
export interface AirConditioning {
  level: ACLevel;
  details?: string;
}
export interface Kitchen {
  scope: KitchenScope;
  details?: string;
}
export interface Laundry {
  location: LaundryLocation;
  details?: string;
}
export interface CommonAreas {
  hasLounge: boolean;
  details?: string;
}
export interface Gym {
  available: boolean;
  details?: string;
}

export interface AmenityData {
  roomTypes: RoomType[];
  bathrooms: Bathrooms;
  ac: AirConditioning;
  kitchen: Kitchen;
  laundry: Laundry;
  commonAreas: CommonAreas;
  gym: Gym;
  genderHousing: GenderHousing;
}

export interface Accessibility {
  wheelchairAccessible: boolean;
  serviceAnimalFriendly: boolean;
  groundFloorRooms: boolean;
  strobeAlarm: boolean;
}

export interface Atmosphere {
  socialness?: number;
  noiseLevel?: number;
}

export interface Location {
  latitude?: number;
  longitude?: number;
  closeBuildings: string[];
  note?: string;
}

export interface GalleryImage {
  link: string;
  description: string;
}
export interface FloorPlan {
  link: string;
  description: string;
  category: "roomType" | "floor";
  virtualTourLink?: string;
}
export interface Media {
  mainImage: string;
  icon?: string;
  photos: GalleryImage[];
  floorPlans: FloorPlan[];
}

export interface Building {
  id: string;
  name: string;
  media: Media;
  amenities: AmenityData;
  accessibility: Accessibility;
  atmosphere: Atmosphere;
  location: Location;
  editorialTags?: string[];
}

export interface FilterState {
  distanceFrom: string;
  socialness: number | null;
  noiseLevel: number | null;
  serviceAnimal: boolean;
  wheelchairAccessible: boolean;
  singleRoom: boolean;
  airConditioning: boolean;
  laundryEachFloor: boolean;
  enSuiteBathroom: boolean;
  genderHousing: GenderHousing | null;
}

export interface Tag {
  id: string;
  label: string;
  icon: string;
}

const acLevelLabel: Record<ACLevel, string> = {
  [ACLevel.None]: "None",
  [ACLevel.ByNecessity]: "By necessity",
  [ACLevel.Window]: "Window units",
  [ACLevel.Central]: "Central",
};

const kitchenScopeLabel: Record<KitchenScope, string> = {
  [KitchenScope.None]: "None",
  [KitchenScope.Shared]: "Shared",
  [KitchenScope.InUnit]: "In unit",
};

function detailsOrLabel(details: string | undefined, label: string): string {
  return details === undefined || details.trim() === "" ? label : details;
}

/** The AC details, or the AC level when no details are written. */
export function acText(ac: AirConditioning): string {
  return detailsOrLabel(ac.details, acLevelLabel[ac.level]);
}

/** The kitchen details, or the kitchen scope when no details are written. */
export function kitchenText(kitchen: Kitchen): string {
  return detailsOrLabel(kitchen.details, kitchenScopeLabel[kitchen.scope]);
}
