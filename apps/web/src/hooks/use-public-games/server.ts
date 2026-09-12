"use server";

import { getPublicGame, getPublicGamePage, listPublicGames } from "@/lib/playmates";
import type { Game, GameWithTeamsAndRecordings, PublicGamePageData } from "./types";

export async function fetchPublicGames(): Promise<GameWithTeamsAndRecordings[]> {
  return listPublicGames();
}

/** Returns `null` for missing or private slugs. Do not prefetch private slugs for SEO. */
export async function fetchPublicGame(slug: string): Promise<Game | null> {
  return getPublicGame(slug);
}

/** Public game page payload, or `null` if the game or its session is private/missing. */
export async function fetchPublicGamePage(slug: string): Promise<PublicGamePageData | null> {
  return getPublicGamePage(slug);
}
