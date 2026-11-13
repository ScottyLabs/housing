import { useEffect, useState } from "react";
import client from "@/api/client";
import type { Preferences } from "@/data/preferences";

export interface PreferencesState {
  loaded: boolean;
  preferences: Preferences | null;
}

export default function usePreferences(): PreferencesState {
  const [state, setState] = useState<PreferencesState>({ loaded: false, preferences: null });

  useEffect(() => {
    let active = true;
    client.GET("/api/me/preferences").then(
      ({ data }) => {
        if (active) setState({ loaded: true, preferences: data ?? null });
      },
      () => {
        if (active) setState({ loaded: true, preferences: null });
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return state;
}
