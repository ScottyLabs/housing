const EARTH_RADIUS_METERS = 6_371_000;
const DETOUR_FACTOR = 1.3;
const WALK_METERS_PER_MINUTE = 80;
const BIKE_METERS_PER_MINUTE = 250;
const DRIVE_METERS_PER_MINUTE = 400;

export interface TravelMinutes {
  walk: number;
  bike: number;
  drive: number;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function metersBetween(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
}

function minutesFor(meters: number, metersPerMinute: number): number {
  return Math.max(1, Math.ceil((meters * DETOUR_FACTOR) / metersPerMinute));
}

export function estimateTravel(meters: number): TravelMinutes {
  return {
    walk: minutesFor(meters, WALK_METERS_PER_MINUTE),
    bike: minutesFor(meters, BIKE_METERS_PER_MINUTE),
    drive: minutesFor(meters, DRIVE_METERS_PER_MINUTE),
  };
}
