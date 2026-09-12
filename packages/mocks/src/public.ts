import { getPlaymatesRepos } from "./get-repos";
import type { Game, Player, SessionDetail, SessionListItem, Venue } from "./types";

/** Public sessions only; nested game counts already exclude private games. */
export async function listPublicSessions(): Promise<SessionListItem[]> {
  return getPlaymatesRepos().sessions.list({ visibility: "public" });
}

/** Session detail for a public slug, or `null` if missing or private. */
export async function getPublicSession(slug: string): Promise<SessionDetail | null> {
  const detail = await getPlaymatesRepos().sessions.getBySlug(slug);
  if (!detail || detail.session.visibility !== "public") return null;
  return {
    ...detail,
    games: detail.games.filter((game) => game.visibility === "public"),
  };
}

/** Game for a public slug, or `null` if the game or its session is private. */
export async function getPublicGame(slug: string): Promise<Game | null> {
  const repos = getPlaymatesRepos();
  const game = await repos.games.getBySlug(slug);
  if (!game || game.visibility !== "public") return null;
  const session = await repos.sessions.getById(game.sessionId);
  if (!session || session.session.visibility !== "public") return null;
  return game;
}

/** Active (non-archived) players for the public site. */
export async function listPublicPlayers(): Promise<Player[]> {
  return getPlaymatesRepos().players.list();
}

/** Player by slug, or `null` if missing or archived. */
export async function getPublicPlayer(slug: string): Promise<Player | null> {
  const player = await getPlaymatesRepos().players.getBySlug(slug);
  if (!player || player.isArchived) return null;
  return player;
}

/** Active (non-archived) venues for the public site. */
export async function listPublicVenues(): Promise<Venue[]> {
  return getPlaymatesRepos().venues.list();
}

/** Venue by slug, or `null` if missing or archived. */
export async function getPublicVenue(slug: string): Promise<Venue | null> {
  const venue = await getPlaymatesRepos().venues.getBySlug(slug);
  if (!venue || venue.isArchived) return null;
  return venue;
}
