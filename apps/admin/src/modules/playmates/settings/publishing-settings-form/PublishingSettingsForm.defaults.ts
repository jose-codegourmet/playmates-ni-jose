import { DEFAULT_FACEBOOK_HASHTAGS, type PlaymatesSettings } from "@fe-template/mocks";

import type { PublishingSettingsFormValues } from "./PublishingSettingsForm.schema";

export const publishingSettingsDefaultValues: PublishingSettingsFormValues = {
  facebookGroupUrl: "",
  defaultHashtags: DEFAULT_FACEBOOK_HASHTAGS,
};

export function getPublishingSettingsDefaultValues(
  settings?: PlaymatesSettings | null,
): PublishingSettingsFormValues {
  if (!settings) return publishingSettingsDefaultValues;

  return {
    facebookGroupUrl: settings.facebookGroupUrl,
    defaultHashtags: settings.defaultHashtags || DEFAULT_FACEBOOK_HASHTAGS,
  };
}
