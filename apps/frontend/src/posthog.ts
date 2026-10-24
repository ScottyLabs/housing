import type { PostHogEnv } from "./vite-env";

import posthog from "posthog-js";

const posthogKey: PostHogEnv["VITE_PUBLIC_POSTHOG_PROJECT_TOKEN"] = import.meta.env
  .VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost: PostHogEnv["VITE_PUBLIC_POSTHOG_HOST"] = import.meta.env
  .VITE_PUBLIC_POSTHOG_HOST;

export const isPostHogInitialized =
  posthogKey !== undefined && posthogKey !== "" && posthogHost !== undefined && posthogHost !== "";

if (posthogKey === undefined || posthogKey === "") {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
    );
  }
} else if (posthogHost !== undefined && posthogHost !== "") {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: "2026-01-30",
    logs: {
      serviceName: "cmu-housing-web",
      environment: import.meta.env.MODE,
    },
    capture_exceptions: {
      capture_console_errors: false,
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
    },
  });
} else {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
    );
  }
}

export default posthog;
