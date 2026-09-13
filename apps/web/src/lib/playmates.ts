import {
  formatGameSlug,
  type GameWithTeamsAndRecordings,
  type Player,
  getPublicGame,
  getPublicPlayer,
  getPublicSession,
  getPublicVenue,
  getState,
  listPublicPlayers,
  listPublicSessions,
  listPublicVenues,
  type ProviderAsset,
  type SessionListItem,
  type Venue,
} from "@fe-template/mocks";

export {
  getPublicGame,
  getPublicPlayer,
  getPublicSession,
  getPublicVenue,
  listPublicPlayers,
  listPublicSessions,
  listPublicVenues,
};

export type PublicGameNeighbor = {
  slug: string;
  gameNumber: number;
};

export type PublicGamePageData = {
  slug: string;
  game: GameWithTeamsAndRecordings;
  sessionSlug: string;
  sessionDate: string;
  sessionTitle: string | null;
  venueName: string | null;
  previous: PublicGameNeighbor | null;
  next: PublicGameNeighbor | null;
  assets: ProviderAsset[];
};

/** Public game with the parent public session slug/date (never a private game). */
export type PublicListedGame = GameWithTeamsAndRecordings & {
  sessionSlug: string;
  sessionDate: string;
};

function playerAppearsOnGame(game: GameWithTeamsAndRecordings, player: Pick<Player, "id">): boolean {
  return game.teams.some((team) => team.players.some((member) => member.id === player.id));
}

function publicNeighbor(
  games: GameWithTeamsAndRecordings[],
  sessionDate: string,
  gameNumber: number,
  delta: number,
): PublicGameNeighbor | null {
  const target = gameNumber + delta;
  const found = games.find((row) => row.gameNumber === target);
  if (!found || found.gameNumber == null) {
    return null;
  }
  return {
    slug: formatGameSlug(sessionDate, found.gameNumber),
    gameNumber: found.gameNumber,
  };
}

/**
 * Public game plus session context. `null` if the game or session is private/missing.
 * Uses the same `getPublicSession` helper as the session page (private games omitted).
 */
export async function getPublicGamePage(slug: string): Promise<PublicGamePageData | null> {
  const game = await getPublicGame(slug);
  if (!game) {
    return null;
  }

  const listed = (await listPublicGames()).find((row) => row.id === game.id);
  if (!listed || listed.gameNumber == null) {
    return null;
  }

  const resolvedSlug = formatGameSlug(listed.sessionDate, listed.gameNumber);
  if (resolvedSlug !== slug) {
    return null;
  }

  const detail = await getPublicSession(listed.sessionSlug);
  if (!detail) {
    return null;
  }

  const current = detail.games.find((row) => row.id === listed.id);
  if (!current || current.gameNumber == null) {
    return null;
  }

  const recordingIds = new Set(current.recordings.map((recording) => recording.id));
  const assets = getState().providerAssets.filter((asset) => recordingIds.has(asset.recordingId));

  return {
    slug: resolvedSlug,
    game: current,
    sessionSlug: detail.session.slug ?? listed.sessionSlug,
    sessionDate: detail.session.sessionDate,
    sessionTitle: detail.session.title,
    venueName: detail.venue?.name ?? null,
    previous: publicNeighbor(detail.games, detail.session.sessionDate, current.gameNumber, -1),
    next: publicNeighbor(detail.games, detail.session.sessionDate, current.gameNumber, 1),
    assets,
  };
}

/** Flatten public games from public sessions. Private sessions/games are never loaded. */
export async function listPublicGames(): Promise<PublicListedGame[]> {
  const sessions = await listPublicSessions();
  const details = await Promise.all(
    sessions.map((item) => (item.slug ? getPublicSession(item.slug) : Promise.resolve(null))),
  );

  const listed: PublicListedGame[] = [];
  for (let index = 0; index < sessions.length; index += 1) {
    const item = sessions[index];
    const detail = details[index];
    if (!item?.slug || !detail) continue;
    for (const game of detail.games) {
      listed.push({
        ...game,
        sessionSlug: item.slug,
        sessionDate: detail.session.sessionDate,
      });
    }
  }
  return listed;
}

/** Public sessions where this player appears on at least one public game. */
export async function listPublicSessionsForPlayer(
  player: Pick<Player, "id">,
): Promise<SessionListItem[]> {
  const [sessions, games] = await Promise.all([listPublicSessions(), listPublicGames()]);
  const slugs = new Set(
    games.filter((game) => playerAppearsOnGame(game, player)).map((game) => game.sessionSlug),
  );
  return sessions.filter((session) => Boolean(session.slug) && slugs.has(session.slug as string));
}

/** Public games this player appears on. */
export async function listPublicGamesForPlayer(
  player: Pick<Player, "id">,
): Promise<PublicListedGame[]> {
  const games = await listPublicGames();
  return games.filter((game) => playerAppearsOnGame(game, player));
}

/** Public sessions at this venue. */
export async function listPublicSessionsForVenue(
  venue: Pick<Venue, "name">,
): Promise<SessionListItem[]> {
  const sessions = await listPublicSessions();
  return sessions.filter((session) => (session.venueName ?? "").trim() === venue.name);
}
