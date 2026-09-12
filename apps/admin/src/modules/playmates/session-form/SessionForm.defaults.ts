import type { SessionFormValues } from "./SessionForm.schema";

export function todayLocalDate(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const sessionFormDefaultValues: SessionFormValues = {
  sessionDate: todayLocalDate(),
  title: "",
  venueId: "",
  courtId: "",
  notes: "",
  playerIds: [],
};

export function getSessionFormDefaultValues(
  overrides?: Partial<SessionFormValues>,
): SessionFormValues {
  return {
    ...sessionFormDefaultValues,
    sessionDate: overrides?.sessionDate ?? todayLocalDate(),
    title: overrides?.title ?? "",
    venueId: overrides?.venueId ?? "",
    courtId: overrides?.courtId ?? "",
    notes: overrides?.notes ?? "",
    playerIds: overrides?.playerIds ?? [],
  };
}
