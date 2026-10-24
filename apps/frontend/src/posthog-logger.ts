import posthog, { isPostHogInitialized } from "./posthog";

export const posthogLogger = {
  surveyPreferencesSaved() {
    if (!isPostHogInitialized) return;
    posthog.logger.info("survey preferences saved", {
      event: "survey_preferences_saved",
      survey_step_count: 3,
    });
  },

  surveyPreferencesSaveFailed() {
    if (!isPostHogInitialized) return;
    posthog.logger.warn("survey preferences save failed", {
      event: "survey_preferences_save_failed",
    });
  },

  comparisonBuildingAdded() {
    if (!isPostHogInitialized) return;
    posthog.logger.info("comparison building added", {
      event: "comparison_building_added",
    });
  },
};
