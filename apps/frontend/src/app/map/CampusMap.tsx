import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import BuildingMarker from "./BuildingMarker";
import type { LatLng, MapMarker } from "./places";

const CAMPUS_CENTER: LatLng = { lat: 40.4433, lng: -79.9436 };
const CAMPUS_ZOOM = 16;

function PanToFocus({ focus }: { focus: LatLng | undefined }) {
  const map = useMap();
  const lat = focus?.lat;
  const lng = focus?.lng;

  useEffect(() => {
    if (map === null || lat === undefined || lng === undefined) return;
    map.panTo({ lat, lng });
  }, [map, lat, lng]);

  return null;
}

export default function CampusMap({
  apiKey,
  mapId,
  markers,
  focus,
  onSelect,
}: {
  apiKey: string;
  mapId: string;
  markers: MapMarker[];
  focus: LatLng | undefined;
  onSelect: (marker: MapMarker) => void;
}) {
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        mapId={mapId}
        defaultCenter={CAMPUS_CENTER}
        defaultZoom={CAMPUS_ZOOM}
        gestureHandling="greedy"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        className="h-full w-full"
      >
        {markers.map((marker) => (
          <BuildingMarker key={marker.id} marker={marker} onSelect={onSelect} />
        ))}
        <PanToFocus focus={focus} />
      </Map>
    </APIProvider>
  );
}
