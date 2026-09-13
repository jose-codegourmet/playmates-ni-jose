import { z } from "zod";

import { sessionFormSchema } from "@/modules/playmates/session-form/SessionForm.schema";

export const SESSION_DETAILS_STATUSES = [
  "draft",
  "organizing",
  "uploading",
  "ready",
  "published",
  "archived",
] as const;

export const sessionDetailsFormSchema = sessionFormSchema.omit({ playerIds: true }).extend({
  visibility: z.enum(["private", "public"]),
  status: z.enum(SESSION_DETAILS_STATUSES),
});

export type SessionDetailsFormValues = z.infer<typeof sessionDetailsFormSchema>;
