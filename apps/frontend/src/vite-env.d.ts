/// <reference types="vite/client" />

export interface PostHogEnv {
  readonly VITE_PUBLIC_POSTHOG_PROJECT_TOKEN?: string;
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
}

declare global {
  interface ImportMetaEnv extends PostHogEnv {}
}
