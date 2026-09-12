import {
  type GameWithTeamsAndRecordings,
  getPublicGame,
  getPublicPlayer,
  getPublicSession,
  getPublicVenue,
  listPublicPlayers,
  listPublicSessions,
  listPublicVenues,
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
