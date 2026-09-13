import { todayLocalDate } from "@/modules/playmates/session-form/SessionForm.defaults";

import type { SessionDetailsFormValues } from "./SessionDetailsForm.schema";

export const sessionDetailsFormDefaultValues: SessionDetailsFormValues = {
  sessionDate: todayLocalDate(),
  title: "",
  venueId: "",
  courtId: "",
  notes: "",
  visibility: "private",
  status: "draft",
};

export function getSessionDetailsFormDefaultValues(
  overrides?: Partial<SessionDetailsFormValues>,
): SessionDetailsFormValues {
  return {
    ...sessionDetailsFormDefaultValues,
    sessionDate: overrides?.sessionDate ?? todayLocalDate(),
    title: overrides?.title ?? "",
    venueId: overrides?.venueId ?? "",
    courtId: overrides?.courtId ?? "",
    notes: overrides?.notes ?? "",
    visibility: overrides?.visibility ?? "private",
    status: overrides?.status ?? "draft",
  };
}
