import type { MockState } from "../seed";
import { requireEntity } from "../store";

export function assertCourtMatchesVenue(
  state: MockState,
  venueId: string | null | undefined,
  courtId: string | null | undefined,
): void {
  if (!courtId) return;
  const court = requireEntity(
    state.courts.find((row) => row.id === courtId),
    "Court",
    courtId,
  );
  if (!venueId || court.venueId !== venueId) {
    throw new Error("Court must belong to the session venue");
  }
}
