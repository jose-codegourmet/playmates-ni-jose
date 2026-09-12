"use server";

import { getPublicPlayer, listPublicPlayers } from "@/lib/playmates";
import type { Player } from "./types";

export async function fetchPublicPlayers(): Promise<Player[]> {
  return listPublicPlayers();
}

/** Returns `null` for missing or archived slugs. Do not prefetch private slugs for SEO. */
export async function fetchPublicPlayer(slug: string): Promise<Player | null> {
  return getPublicPlayer(slug);
}
