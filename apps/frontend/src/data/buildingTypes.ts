export enum RoomType {
  TradSingle,
  TradDouble,
  TradTriple,
  SemiSuiteSingle,
  SemiSuiteDouble,
  SemiSuiteTriple,
  SemiSuiteQuad,
  ApartmentTriple,
  StudioApartmentSingle,
  StudioApartmentDouble,
}

export enum BathroomType {
  Communal,
  SharedSuite,
  Private,
}

export enum ACLevel {
  None,
  ByNecessity,
  Window,
  Central,
}

export enum LaundryLocation {
  None,
  Basement,
  EachFloor,
  InUnit,
}

export enum KitchenScope {
  None,
  Shared,
  InUnit,
}

export enum GenderHousing {
  CoEd,
  WomenOnly,
  MenOnly,
  GenderInclusive,
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

export interface Tag {
  id: string;
  label: string;
  icon: string;
}
