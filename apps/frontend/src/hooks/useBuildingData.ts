import { useCallback, useEffect, useRef, useState } from "react";
import client from "@/api/client";
import { toBuilding } from "@/data/apiBuildings";
import type { Building, CampusBuilding } from "@/data/buildingTypes";

export type BuildingData =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "loaded"; buildings: Building[]; campusBuildings: CampusBuilding[] };

async function fetchBuildingData(): Promise<BuildingData> {
  const [buildings, campus] = await Promise.all([
    client.GET("/api/buildings"),
    client.GET("/api/campus-buildings"),
  ]);
  if (buildings.data === undefined || campus.data === undefined) return { status: "failed" };
  return {
    buildings: buildings.data.map((building) => toBuilding(building)),
    campusBuildings: campus.data,
    status: "loaded",
  };
}

export default function useBuildingData(): { data: BuildingData; reload: () => void } {
  const [data, setData] = useState<BuildingData>({ status: "loading" });
  const latestRequest = useRef(0);

  const load = useCallback(() => {
    latestRequest.current += 1;
    const request = latestRequest.current;
    fetchBuildingData().then(
      (next) => {
        if (request === latestRequest.current) setData(next);
      },
      () => {
        if (request === latestRequest.current) setData({ status: "failed" });
      },
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reload = useCallback(() => {
    setData((previous) => (previous.status === "failed" ? { status: "loading" } : previous));
    load();
  }, [load]);

  return { data, reload };
}
