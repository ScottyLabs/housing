import { AdvancedMarker } from "@vis.gl/react-google-maps";
import MarkerBody from "./MarkerBody";
import type { MapMarker } from "./places";

export default function BuildingMarker({
  marker,
  onSelect,
}: {
  marker: MapMarker;
  onSelect: (marker: MapMarker) => void;
}) {
  const highlighted = marker.state !== "default";

  return (
    <AdvancedMarker
      position={marker.position}
      title={marker.name}
      zIndex={highlighted ? 2 : 1}
      anchorLeft="-50%"
      anchorTop="-50%"
      onClick={() => {
        onSelect(marker);
      }}
    >
      <div className="relative">
        {highlighted && (
          <span className="absolute bottom-full left-1/2 mb-1 w-max max-w-28 -translate-x-1/2 rounded-lg bg-white px-2 py-1 text-center text-[11px] leading-tight shadow-md">
            {marker.name}
          </span>
        )}
        <MarkerBody marker={marker} />
      </div>
    </AdvancedMarker>
  );
}
