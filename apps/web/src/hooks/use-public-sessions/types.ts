import type { SessionDetail, SessionListItem } from "@fe-template/mocks";

export type { SessionDetail, SessionListItem };

/** Client-side index filters (PNJ-044). Applied in memory to the public list. */
export type PublicSessionFilters = {
  /** `YYYY-MM-DD` exact date or `YYYY-MM` month prefix. */
  date?: string;
  /** Player display name from the public roster. */
  player?: string;
  /** Venue display name. */
  venue?: string;
};

export function filterPublicSessions(
  sessions: SessionListItem[],
  filters?: PublicSessionFilters,
): SessionListItem[] {
  if (!filters) return sessions;

  const date = filters.date?.trim();
  const player = filters.player?.trim().toLowerCase();
  const venue = filters.venue?.trim().toLowerCase();

  return sessions.filter((session) => {
    if (date && !session.date.startsWith(date)) return false;
    if (player && !session.playerNames.some((name) => name.toLowerCase() === player)) {
      return false;
    }
    if (venue && (session.venueName ?? "").toLowerCase() !== venue) return false;
    return true;
  });
}
