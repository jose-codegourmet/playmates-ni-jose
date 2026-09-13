"use server";

import { getState, persistState } from "@fe-template/mocks";
import { revalidatePath } from "next/cache";

import {
  type PublishingSettingsFormValues,
  publishingSettingsSchema,
} from "@/modules/playmates/settings/publishing-settings-form/PublishingSettingsForm.schema";

export type PublishingSettingsActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function savePublishingSettings(
  data: PublishingSettingsFormValues,
): Promise<PublishingSettingsActionResult> {
  const parsed = publishingSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  try {
    const state = getState();
    state.settings.facebookGroupUrl = parsed.data.facebookGroupUrl.trim();
    state.settings.defaultHashtags = parsed.data.defaultHashtags.trim();
    persistState();
    revalidatePath("/settings/publishing");
    revalidatePath("/sessions", "layout");
    revalidatePath("/dashboard");
    return { success: true, message: "Publishing settings saved." };
  } catch {
    return { success: false, error: "Could not save publishing settings." };
  }
}
