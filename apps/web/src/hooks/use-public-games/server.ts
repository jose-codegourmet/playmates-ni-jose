"use server";

import type { Player } from "@fe-template/mocks";
import {
  getPublicGame,
  getPublicGamePage,
  listPublicGames,
  listPublicGamesForPlayer,
} from "@/lib/playmates";
import type { Game, PublicGamePageData, PublicListedGame } from "./types";

export async function fetchPublicGames(): Promise<PublicListedGame[]> {
  return listPublicGames();
}

export async function fetchPublicGamesForPlayer(
  player: Pick<Player, "id">,
): Promise<PublicListedGame[]> {
  return listPublicGamesForPlayer(player);
}

/** Returns `null` for missing or private slugs. Do not prefetch private slugs for SEO. */
export async function fetchPublicGame(slug: string): Promise<Game | null> {
  return getPublicGame(slug);
}

/** Public game page payload, or `null` if the game or its session is private/missing. */
export async function fetchPublicGamePage(slug: string): Promise<PublicGamePageData | null> {
  return getPublicGamePage(slug);
}
