import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { MapMarker, MarkerState } from "./places";

const CHIP_STYLES: Record<MarkerState, string> = {
  default: "bg-[#0c8987] text-white",
  origin: "bg-brand-primary text-white",
  selected: "bg-brand-primary text-white ring-2 ring-white",
};

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
        <span
          className={`flex h-9 min-w-9 items-center justify-center rounded-full px-1 text-[10px] font-semibold shadow ${CHIP_STYLES[marker.state]}`}
        >
          {marker.code}
        </span>
      </div>
    </AdvancedMarker>
  );
}
