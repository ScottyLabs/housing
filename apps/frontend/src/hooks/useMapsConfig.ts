import { useEffect, useState } from "react";

export type MapsConfig =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "disabled" }
  | { status: "ready"; apiKey: string; mapId: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseConfig(body: unknown): MapsConfig {
  if (!isRecord(body)) return { status: "failed" };
  if (body.enabled === false) return { status: "disabled" };
  const { apiKey, mapId } = body;
  if (body.enabled === true && typeof apiKey === "string" && typeof mapId === "string") {
    return { status: "ready", apiKey, mapId };
  }
  return { status: "failed" };
}

async function fetchConfig(): Promise<MapsConfig> {
  try {
    const response = await fetch("/api/config/maps/", { credentials: "include" });
    if (!response.ok) return { status: "failed" };
    return parseConfig(await response.json());
  } catch {
    return { status: "failed" };
  }
}

export default function useMapsConfig(): MapsConfig {
  const [config, setConfig] = useState<MapsConfig>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchConfig().then((next) => {
      if (!cancelled) setConfig(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}
