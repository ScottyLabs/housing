import StatusMessage from "@/components/StatusMessage";
import useMapsConfig, { type MapsConfig } from "@/hooks/useMapsConfig";
import BuildingList from "./map/BuildingList";
import CampusMap from "./map/CampusMap";
import MapToolbar from "./map/MapToolbar";
import useMapSelection from "./map/useMapSelection";

function placeholderMessage(config: MapsConfig): string {
  if (config.status === "disabled") return "The map is not set up in this environment.";
  if (config.status === "failed") return "Could not load the map.";
  return "Loading map";
}

export default function MapPage() {
  const config = useMapsConfig();
  const selection = useMapSelection();

  return (
    <div className="flex flex-col gap-3 px-4 pt-[26px] sm:px-8 md:h-[calc(100dvh-7rem)] lg:px-10">
      <h1 className="sr-only">Campus map</h1>
      <MapToolbar
        origin={selection.origin}
        query={selection.query}
        housingClass={selection.housingClass}
        onOriginChange={selection.setOriginId}
        onQueryChange={selection.setQuery}
        onHousingClassChange={selection.setHousingClass}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
        <div className="h-[60vh] overflow-hidden rounded-2xl border border-black/10 md:h-auto md:flex-1">
          {config.status === "ready" ? (
            <CampusMap
              apiKey={config.apiKey}
              mapId={config.mapId}
              markers={selection.markers}
              focus={selection.focus}
              onSelect={selection.clickMarker}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <StatusMessage
                message={placeholderMessage(config)}
                error={config.status === "failed"}
              />
            </div>
          )}
        </div>
        <div className="md:min-h-0 md:w-[400px] md:shrink-0">
          {selection.ready ? (
            <BuildingList
              entries={selection.entries}
              selectedId={selection.selectedId}
              onSelect={selection.selectHousing}
            />
          ) : (
            <StatusMessage message="Loading buildings" />
          )}
        </div>
      </div>
    </div>
  );
}
