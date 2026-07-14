export enum RoomType {
    TradSingle = "tradSingle",
    TradDouble = "tradDouble",
    TradTriple = "tradTriple",
    SemiSuiteSingle = "semiSuiteSingle",
    SemiSuiteDouble = "semiSuiteDouble",
    SemiSuiteTriple = "semiSuiteTriple",
    SemiSuiteQuad = "semiSuiteQuad",
    ApartmentTriple = "aptTriple",
    StudioApartmentSingle = "studioAptSingle",
    StudioApartmentDouble = "studioAptDouble"
}

export enum BathroomType {
    Communal = "communal",
    SharedSuite = "sharedSuite",
    Private = "private"
}

export enum ACLevel {
    None = "none",
    ByNecessity = "byNecessity",
    Window = "window",
    Central = "central"
}

export enum LaundryLocation {
    None = "none",
    Basement = "basement",
    EachFloor = "eachFloor",
    InUnit = "inUnit"
}

export enum KitchenScope {
    None = "none",
    Shared = "shared",
    InUnit = "inUnit"
}

export enum GenderHousing {
    CoEd = "coed",
    WomenOnly = "womenOnly",
    MenOnly = "menOnly",
    GenderInclusive = "genderInclusive"
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
