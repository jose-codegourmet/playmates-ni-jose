import { getState } from "@fe-template/mocks";

import { PublishingSettingsForm } from "@/modules/playmates/settings/publishing-settings-form/PublishingSettingsForm";

export default function PublishingSettingsPage() {
  const settings = getState().settings;
  return <PublishingSettingsForm settings={settings} />;
}
