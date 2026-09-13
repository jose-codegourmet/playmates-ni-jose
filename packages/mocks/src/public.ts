import { getPlaymatesRepos } from "./get-repos";
import type {
  Game,
  GameWithTeamsAndRecordings,
  Player,
  SessionDetail,
  SessionListItem,
  Venue,
} from "./types";

function playerIdsOnGames(games: GameWithTeamsAndRecordings[]): Set<string> {
  const ids = new Set<string>();
  for (const game of games) {
    for (const team of game.teams) {
      for (const player of team.players) {
        ids.add(player.id);
      }
    }
  }
  return ids;
}

/** Public sessions only. Nested game counts and player names exclude private games. */
export async function listPublicSessions(): Promise<SessionListItem[]> {
  return getPlaymatesRepos().sessions.list({ visibility: "public" });
}

/**
 * Session detail for a public slug, or `null` if missing or private.
 * Visibility is the only public filter — status / publishedAt are ignored.
 * Private games are omitted; roster is limited to players on remaining public games.
 */
export async function getPublicSession(slug: string): Promise<SessionDetail | null> {
  const detail = await getPlaymatesRepos().sessions.getBySlug(slug);
  if (!detail || detail.session.visibility !== "public") return null;
  const games = detail.games.filter((game) => game.visibility === "public");
  const publicPlayerIds = playerIdsOnGames(games);
  return {
    ...detail,
    games,
    players: detail.players.filter((player) => publicPlayerIds.has(player.id)),
  };
}

/** Flatten public games from public sessions. Private games never appear. */
export async function listPublicGames(): Promise<GameWithTeamsAndRecordings[]> {
  const sessions = await listPublicSessions();
  const details = await Promise.all(
    sessions.map((session) =>
      session.slug ? getPublicSession(session.slug) : Promise.resolve(null),
    ),
  );
  return details.flatMap((detail) => detail?.games ?? []);
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

async function publicFacingPlayerIds(): Promise<Set<string>> {
  return playerIdsOnGames(await listPublicGames());
}

/** Players who appear on at least one public game. Archived / private-only players are omitted. */
export async function listPublicPlayers(): Promise<Player[]> {
  const ids = await publicFacingPlayerIds();
  const players = await getPlaymatesRepos().players.list();
  return players.filter((player) => ids.has(player.id));
}

/** Player by slug, or `null` if missing, archived, or not on any public game. */
export async function getPublicPlayer(slug: string): Promise<Player | null> {
  const player = await getPlaymatesRepos().players.getBySlug(slug);
  if (!player || player.isArchived) return null;
  const ids = await publicFacingPlayerIds();
  if (!ids.has(player.id)) return null;
  return player;
}

function publicVenueNames(sessions: SessionListItem[]): Set<string> {
  const names = new Set<string>();
  for (const session of sessions) {
    const name = session.venueName?.trim();
    if (name) names.add(name);
  }
  return names;
}

/** Venues that host at least one public session. */
export async function listPublicVenues(): Promise<Venue[]> {
  const names = publicVenueNames(await listPublicSessions());
  const venues = await getPlaymatesRepos().venues.list();
  return venues.filter((venue) => names.has(venue.name));
}

/** Venue by slug, or `null` if missing, archived, or without a public session. */
export async function getPublicVenue(slug: string): Promise<Venue | null> {
  const venue = await getPlaymatesRepos().venues.getBySlug(slug);
  if (!venue || venue.isArchived) return null;
  const names = publicVenueNames(await listPublicSessions());
  if (!names.has(venue.name)) return null;
  return venue;
}
