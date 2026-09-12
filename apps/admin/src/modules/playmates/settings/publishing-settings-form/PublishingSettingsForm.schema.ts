import { z } from "zod";

export const publishingSettingsSchema = z.object({
  facebookGroupUrl: z.string(),
  defaultHashtags: z.string().trim().min(1, "Default hashtags are required"),
});

export type PublishingSettingsFormValues = z.infer<typeof publishingSettingsSchema>;
