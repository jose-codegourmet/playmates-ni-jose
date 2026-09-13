"use server";

import type { Player, Venue } from "@fe-template/mocks";
import {
  getPublicSession,
  listPublicSessions,
  listPublicSessionsForPlayer,
  listPublicSessionsForVenue,
} from "@/lib/playmates";
import type { SessionDetail, SessionListItem } from "./types";

export async function fetchPublicSessions(): Promise<SessionListItem[]> {
  return listPublicSessions();
}

export async function fetchPublicSessionsForPlayer(
  player: Pick<Player, "id">,
): Promise<SessionListItem[]> {
  return listPublicSessionsForPlayer(player);
}

export async function fetchPublicSessionsForVenue(
  venue: Pick<Venue, "name">,
): Promise<SessionListItem[]> {
  return listPublicSessionsForVenue(venue);
}

/** Returns `null` for missing or private slugs. Do not prefetch private slugs for SEO. */
export async function fetchPublicSession(slug: string): Promise<SessionDetail | null> {
  return getPublicSession(slug);
}
