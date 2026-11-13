import {
  ACLevel,
  BathroomType,
  type Building,
  type FeatureFilter,
  KitchenScope,
  LaundryLocation,
  RoomType,
} from "./buildingTypes";

function hasRoom(building: Building, wanted: RoomType[]): boolean {
  return building.amenities.roomTypes.some((room) => wanted.includes(room));
}

function hasBathroom(building: Building, wanted: BathroomType[]): boolean {
  return building.amenities.bathrooms.types.some((type) => wanted.includes(type));
}

const featureChecks: Record<FeatureFilter, (building: Building) => boolean> = {
  serviceAnimal: (b) => b.accessibility.serviceAnimalFriendly,
  wheelchairAccessible: (b) => b.accessibility.wheelchairAccessible,
  groundFloor: (b) => b.accessibility.groundFloorRooms,
  singleRoom: (b) =>
    hasRoom(b, [RoomType.TradSingle, RoomType.SemiSuiteSingle, RoomType.StudioApartmentSingle]),
  doubleRoom: (b) =>
    hasRoom(b, [RoomType.TradDouble, RoomType.SemiSuiteDouble, RoomType.StudioApartmentDouble]),
  tripleOrLarger: (b) =>
    hasRoom(b, [
      RoomType.TradTriple,
      RoomType.SemiSuiteTriple,
      RoomType.SemiSuiteQuad,
      RoomType.ApartmentTriple,
    ]),
  studioApartment: (b) =>
    hasRoom(b, [RoomType.StudioApartmentSingle, RoomType.StudioApartmentDouble]),
  airConditioning: (b) =>
    b.amenities.ac.level === ACLevel.Window || b.amenities.ac.level === ACLevel.Central,
  centralAC: (b) => b.amenities.ac.level === ACLevel.Central,
  laundryEachFloor: (b) => b.amenities.laundry.location === LaundryLocation.EachFloor,
  enSuiteBathroom: (b) => hasBathroom(b, [BathroomType.SharedSuite, BathroomType.Private]),
  privateBathroom: (b) => hasBathroom(b, [BathroomType.Private]),
  enSuiteKitchen: (b) => b.amenities.kitchen.scope === KitchenScope.InUnit,
  kitchenAccess: (b) => b.amenities.kitchen.scope !== KitchenScope.None,
  commonAreas: (b) => b.amenities.commonAreas.hasLounge,
  gym: (b) => b.amenities.gym.available,
};

export function buildingHasFeature(building: Building, feature: FeatureFilter): boolean {
  return featureChecks[feature](building);
}
