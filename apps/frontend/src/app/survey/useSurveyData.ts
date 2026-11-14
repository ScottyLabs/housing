import { useCallback, useEffect, useRef, useState } from "react";
import client from "@/api/client";

// debounce slider drags
const AUTOSAVE_DELAY_MS = 500;

export interface SurveyData {
  gender: string;
  year: string;
  major: string;
  cookingFrequency: number;
  gymFrequency: number;
  productiveAroundOthers: number;
  needsAloneTime: number;
  socialFrequency: number;
  goals: string[];
  accommodations: string[];
  preferredAmenities: string[];
}

export type SaveStatus = "idle" | "saving" | "saved" | "signed-out" | "failed";

const initialSurveyData: SurveyData = {
  gender: "",
  year: "",
  major: "",
  cookingFrequency: 3,
  gymFrequency: 3,
  productiveAroundOthers: 3,
  needsAloneTime: 3,
  socialFrequency: 3,
  goals: [],
  accommodations: [],
  preferredAmenities: [],
};

type SavedNumber = string | number | null;

interface SavedPreferences {
  accommodations: string[] | null;
  cookingFrequency: SavedNumber;
  goals: string[] | null;
  gymFrequency: SavedNumber;
  major: string | null;
  needsAloneTime: SavedNumber;
  preferredAmenities: string[] | null;
  preferredGenderHousing: string | null;
  productiveAroundOthers: SavedNumber;
  socialFrequency: SavedNumber;
  year: string | null;
}

function toNumber(value: SavedNumber, fallback: number): number {
  return value === null ? fallback : Number(value);
}

function fromSaved(saved: SavedPreferences): SurveyData {
  return {
    gender: saved.preferredGenderHousing ?? "",
    year: saved.year ?? "",
    major: saved.major ?? "",
    cookingFrequency: toNumber(saved.cookingFrequency, initialSurveyData.cookingFrequency),
    gymFrequency: toNumber(saved.gymFrequency, initialSurveyData.gymFrequency),
    productiveAroundOthers: toNumber(
      saved.productiveAroundOthers,
      initialSurveyData.productiveAroundOthers,
    ),
    needsAloneTime: toNumber(saved.needsAloneTime, initialSurveyData.needsAloneTime),
    socialFrequency: toNumber(saved.socialFrequency, initialSurveyData.socialFrequency),
    goals: saved.goals ?? [],
    accommodations: saved.accommodations ?? [],
    preferredAmenities: saved.preferredAmenities ?? [],
  };
}

function orNull(value: string | undefined): string | null | undefined {
  return value === undefined ? undefined : value || null;
}

function toPreferencesBody(fields: Partial<SurveyData>) {
  return {
    accommodations: fields.accommodations,
    cookingFrequency: fields.cookingFrequency,
    goals: fields.goals,
    gymFrequency: fields.gymFrequency,
    major: orNull(fields.major),
    needsAloneTime: fields.needsAloneTime,
    preferredAmenities: fields.preferredAmenities,
    preferredGenderHousing: orNull(fields.gender),
    productiveAroundOthers: fields.productiveAroundOthers,
    socialFrequency: fields.socialFrequency,
    year: orNull(fields.year),
  };
}

async function sendPreferences(fields: Partial<SurveyData>): Promise<SaveStatus> {
  try {
    // survive page unload
    const { response } = await client.PUT("/api/me/preferences", {
      body: toPreferencesBody(fields),
      keepalive: true,
    });
    if (response.ok) return "saved";
    return response.status === 401 ? "signed-out" : "failed";
  } catch {
    return "failed";
  }
}

function useAutosave() {
  const pending = useRef<Partial<SurveyData>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastRequest = useRef(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
    const fields = pending.current;
    if (Object.keys(fields).length === 0) return;
    pending.current = {};
    const request = ++lastRequest.current;
    setSaveStatus("saving");
    void sendPreferences(fields).then((status) => {
      // ignore stale responses
      if (request === lastRequest.current) setSaveStatus(status);
    });
  }, []);

  useEffect(() => {
    globalThis.addEventListener("pagehide", flush);
    return () => {
      globalThis.removeEventListener("pagehide", flush);
      flush();
    };
  }, [flush]);

  const queue = (fields: Partial<SurveyData>) => {
    pending.current = { ...pending.current, ...fields };
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, AUTOSAVE_DELAY_MS);
  };

  const cancel = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    pending.current = {};
  };

  return { saveStatus, queue, cancel };
}

export function useSurveyData() {
  const [data, setData] = useState<SurveyData>(initialSurveyData);
  const autosave = useAutosave();

  useEffect(() => {
    void client.GET("/api/me/preferences").then(({ data: saved }) => {
      if (saved) setData(fromSaved(saved));
    });
  }, []);

  const updateData = (fields: Partial<SurveyData>) => {
    setData((prev) => ({ ...prev, ...fields }));
    autosave.queue(fields);
  };

  const submit = () => {
    autosave.cancel();
    return sendPreferences(data);
  };

  return { data, updateData, submit, saveStatus: autosave.saveStatus };
}
