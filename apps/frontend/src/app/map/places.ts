import type { Building, CampusBuilding } from "@/data/buildingTypes";
import { estimateTravel, metersBetween, type TravelMinutes } from "@/data/distance";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface HousingEntry {
  building: Building;
  meters: number;
  position: LatLng;
  travel: TravelMinutes;
}

export type MarkerState = "default" | "origin" | "selected";

export interface MapMarker {
  id: string;
  code: string;
  name: string;
  position: LatLng;
  kind: "housing" | "campus";
  state: MarkerState;
}

export const DEFAULT_ORIGIN_ID = "margaret-morrison-hall";

export function sortedCampus(campusBuildings: CampusBuilding[]): CampusBuilding[] {
  return campusBuildings.toSorted((a, b) => a.name.localeCompare(b.name));
}

export function findOrigin(campusBuildings: CampusBuilding[], id: string): CampusBuilding {
  const found = campusBuildings.find((campus) => campus.id === id);
  if (found === undefined) throw new Error(`Unknown campus building "${id}"`);
  return found;
}

function normalize(query: string): string {
  return query.trim().toLowerCase();
}

function matches(needle: string, name: string, code: string): boolean {
  return (
    needle === "" || name.toLowerCase().includes(needle) || code.toLowerCase().includes(needle)
  );
}

function toEntry(building: Building, origin: CampusBuilding): HousingEntry[] {
  const { latitude, longitude } = building.location;
  if (latitude === undefined || longitude === undefined) return [];
  const meters = metersBetween(origin.latitude, origin.longitude, latitude, longitude);
  return [
    {
      building,
      meters,
      position: { lat: latitude, lng: longitude },
      travel: estimateTravel(meters),
    },
  ];
}

export function housingByDistance(
  origin: CampusBuilding,
  query: string,
  source: Building[],
): HousingEntry[] {
  const needle = normalize(query);
  return source
    .flatMap((building) => toEntry(building, origin))
    .filter((entry) => matches(needle, entry.building.name, entry.building.code))
    .toSorted((a, b) => a.meters - b.meters);
}

function housingState(id: string, originId: string, selectedId: string): MarkerState {
  if (id === selectedId) return "selected";
  return id === originId ? "origin" : "default";
}

function housingMarker(entry: HousingEntry, originId: string, selectedId: string): MapMarker {
  return {
    id: entry.building.id,
    code: entry.building.code,
    name: entry.building.name,
    position: entry.position,
    kind: "housing",
    state: housingState(entry.building.id, originId, selectedId),
  };
}

function campusMarker(campus: CampusBuilding, originId: string): MapMarker {
  return {
    id: campus.id,
    code: campus.code,
    name: campus.name,
    position: { lat: campus.latitude, lng: campus.longitude },
    kind: "campus",
    state: campus.id === originId ? "origin" : "default",
  };
}

export interface MarkerOptions {
  campusBuildings: CampusBuilding[];
  query: string;
  selectedId: string;
}

export function buildMarkers(
  entries: HousingEntry[],
  origin: CampusBuilding,
  { campusBuildings, query, selectedId }: MarkerOptions,
): MapMarker[] {
  const needle = normalize(query);
  const shownHousing = new Set(entries.map((entry) => entry.building.id));
  const campus = campusBuildings
    .filter((place) => !shownHousing.has(place.id))
    .filter((place) => place.id === origin.id || matches(needle, place.name, place.code))
    .map((place) => campusMarker(place, origin.id));
  const housing = entries.map((entry) => housingMarker(entry, origin.id, selectedId));
  return [...campus, ...housing];
}
