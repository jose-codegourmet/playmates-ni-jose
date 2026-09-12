"use server";

import { getPublicGame, listPublicGames } from "@/lib/playmates";
import type { Game, GameWithTeamsAndRecordings } from "./types";

export async function fetchPublicGames(): Promise<GameWithTeamsAndRecordings[]> {
  return listPublicGames();
}

/** Returns `null` for missing or private slugs. Do not prefetch private slugs for SEO. */
export async function fetchPublicGame(slug: string): Promise<Game | null> {
  return getPublicGame(slug);
}
