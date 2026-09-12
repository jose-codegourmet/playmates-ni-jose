import {
  formatGameSlug,
  type GameWithTeamsAndRecordings,
  getPlaymatesRepos,
  getPublicGame,
  getPublicPlayer,
  getPublicSession,
  getPublicVenue,
  getState,
  listPublicPlayers,
  listPublicSessions,
  listPublicVenues,
  type ProviderAsset,
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

function publicNeighbor(
  games: GameWithTeamsAndRecordings[],
  sessionDate: string,
  gameNumber: number,
  delta: number,
): PublicGameNeighbor | null {
  const target = gameNumber + delta;
  const found = games.find((row) => row.gameNumber === target && row.visibility === "public");
  if (!found || found.gameNumber == null) {
    return null;
  }
  return {
    slug: formatGameSlug(sessionDate, found.gameNumber),
    gameNumber: found.gameNumber,
  };
}

/** Public game plus session context. `null` if the game or session is private/missing. */
export async function getPublicGamePage(slug: string): Promise<PublicGamePageData | null> {
  const game = await getPublicGame(slug);
  if (!game) {
    return null;
  }

  const detail = await getPlaymatesRepos().sessions.getById(game.sessionId);
  if (detail?.session.visibility !== "public") {
    return null;
  }

  const publicGames = detail.games.filter((row) => row.visibility === "public");
  const current = publicGames.find((row) => row.id === game.id);
  if (!current || current.gameNumber == null) {
    return null;
  }

  const resolvedSlug = formatGameSlug(detail.session.sessionDate, current.gameNumber);
  if (resolvedSlug !== slug) {
    return null;
  }

  const recordingIds = new Set(current.recordings.map((recording) => recording.id));
  const assets = getState().providerAssets.filter((asset) => recordingIds.has(asset.recordingId));

  return {
    slug: resolvedSlug,
    game: current,
    sessionSlug: detail.session.slug ?? detail.session.sessionDate,
    sessionDate: detail.session.sessionDate,
    sessionTitle: detail.session.title,
    venueName: detail.venue?.name ?? null,
    previous: publicNeighbor(publicGames, detail.session.sessionDate, current.gameNumber, -1),
    next: publicNeighbor(publicGames, detail.session.sessionDate, current.gameNumber, 1),
    assets,
  };
}

/** Flatten public games from public sessions. Private sessions are never loaded. */
export async function listPublicGames(): Promise<GameWithTeamsAndRecordings[]> {
  const sessions = await listPublicSessions();
  const details = await Promise.all(
    sessions.map((session) =>
      session.slug ? getPublicSession(session.slug) : Promise.resolve(null),
    ),
  );
  return details.flatMap((detail) => detail?.games ?? []);
}
