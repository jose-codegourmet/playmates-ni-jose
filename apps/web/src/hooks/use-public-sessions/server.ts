"use server";

import { getPublicSession, listPublicSessions } from "@/lib/playmates";
import type { SessionDetail, SessionListItem } from "./types";

export async function fetchPublicSessions(): Promise<SessionListItem[]> {
  return listPublicSessions();
}

/** Returns `null` for missing or private slugs. Do not prefetch private slugs for SEO. */
export async function fetchPublicSession(slug: string): Promise<SessionDetail | null> {
  return getPublicSession(slug);
}
