import { useState } from "react";
import { buildings } from "@/data/buildings";
import type { CampusBuilding, HousingClass } from "@/data/buildingTypes";
import { buildingsForClass } from "@/data/housing";
import useHousingClass from "@/hooks/useHousingClass";
import usePreferences from "@/hooks/usePreferences";
import {
  buildMarkers,
  DEFAULT_ORIGIN_ID,
  findOrigin,
  housingByDistance,
  type HousingEntry,
  type LatLng,
  type MapMarker,
} from "./places";

export interface MapSelection {
  origin: CampusBuilding;
  entries: HousingEntry[];
  markers: MapMarker[];
  selectedId: string;
  focus: LatLng | undefined;
  housingClass: HousingClass;
  ready: boolean;
  query: string;
  setHousingClass: (housingClass: HousingClass) => void;
  setQuery: (query: string) => void;
  setOriginId: (id: string) => void;
  selectHousing: (id: string) => void;
  clickMarker: (marker: MapMarker) => void;
}

export default function useMapSelection(): MapSelection {
  const [originId, setOriginId] = useState(DEFAULT_ORIGIN_ID);
  const [pickedId, setPickedId] = useState("");
  const [query, setQuery] = useState("");

  const { housingClass, setHousingClass, ready } = useHousingClass(usePreferences());

  const origin = findOrigin(originId);
  const available = ready ? buildingsForClass(buildings, housingClass) : [];
  const entries = housingByDistance(origin, query, available);
  const selected = entries.find((entry) => entry.building.id === pickedId) ?? entries.at(0);
  const selectedId = selected?.building.id ?? "";

  const clickMarker = (marker: MapMarker) => {
    if (marker.kind === "housing") {
      setPickedId(marker.id);
    } else {
      setOriginId(marker.id);
    }
  };

  return {
    origin,
    entries,
    markers: buildMarkers(entries, origin, selectedId, query),
    selectedId,
    focus: selected?.position,
    housingClass,
    ready,
    query,
    setHousingClass,
    setQuery,
    setOriginId,
    selectHousing: setPickedId,
    clickMarker,
  };
}
