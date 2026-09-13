import { formatSessionFolderName } from "../naming";
import type { SessionRepository } from "../repositories/types";
import { getState, newId, nowIso, persistState, requireEntity, uniqueSlug } from "../store";
import type { GameWithTeamsAndRecordings, Session, SessionDetail, SessionListItem } from "../types";
import { assertCourtMatchesVenue } from "./helpers";

function toListItem(session: Session, visibility?: Session["visibility"]): SessionListItem {
  const state = getState();
  const venue = session.venueId
    ? (state.venues.find((row) => row.id === session.venueId) ?? null)
    : null;
  const games = state.games.filter((game) => {
    if (game.sessionId !== session.id) return false;
    if (visibility && game.visibility !== visibility) return false;
    return true;
  });
  const rosterIds = state.sessionPlayers
    .filter((row) => row.sessionId === session.id)
    .map((row) => row.playerId);
  const playerNames = rosterIds
    .map((id) => state.players.find((player) => player.id === id)?.displayName)
    .filter((name): name is string => Boolean(name));

  return {
    date: session.sessionDate,
    title: session.title,
    slug: session.slug,
    venueName: venue?.name ?? null,
    gameCount: games.length,
    playerNames,
    visibility: session.visibility,
    status: session.status,
  };
}

function toDetail(session: Session, visibility?: Session["visibility"]): SessionDetail {
  const state = getState();
  const venue = session.venueId
    ? (state.venues.find((row) => row.id === session.venueId) ?? null)
    : null;
  const court = session.courtId
    ? (state.courts.find((row) => row.id === session.courtId) ?? null)
    : null;
  const playerIds = state.sessionPlayers
    .filter((row) => row.sessionId === session.id)
    .map((row) => row.playerId);
  const players = playerIds
    .map((id) => state.players.find((player) => player.id === id))
    .filter((player): player is NonNullable<typeof player> => Boolean(player));

  const games: GameWithTeamsAndRecordings[] = state.games
    .filter((game) => {
      if (game.sessionId !== session.id) return false;
      if (visibility && game.visibility !== visibility) return false;
      return true;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((game) => {
      const teams = state.gameTeams
        .filter((team) => team.gameId === game.id)
        .sort((a, b) => a.teamNo - b.teamNo)
        .map((team) => {
          const members = state.gameTeamPlayers
            .filter((row) => row.gameTeamId === team.id)
            .sort((a, b) => a.sortOrder - b.sortOrder);
          return {
            ...team,
            players: members
              .map((member) => state.players.find((player) => player.id === member.playerId))
              .filter((player): player is NonNullable<typeof player> => Boolean(player)),
          };
        });
      const recordings = state.recordings
        .filter((recording) => recording.gameId === game.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return { ...game, teams, recordings };
    });

  return { session, venue, court, players, games };
}

export function createSessionRepository(): SessionRepository {
  return {
    async list(opts) {
      const visibility = opts?.visibility;
      return getState()
        .sessions.filter((session) => (visibility ? session.visibility === visibility : true))
        .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))
        .map((session) => toListItem(session, visibility));
    },

    async getById(id) {
      const session = getState().sessions.find((row) => row.id === id);
      return session ? toDetail(session) : null;
    },

    async getBySlug(slug) {
      const session = getState().sessions.find((row) => row.slug === slug);
      return session ? toDetail(session) : null;
    },

    async create(input) {
      const state = getState();
      const venueId = input.venueId ?? null;
      const courtId = input.courtId ?? null;
      assertCourtMatchesVenue(state, venueId, courtId);
      const now = nowIso();
      const session: Session = {
        id: newId(),
        sessionDate: input.sessionDate,
        title: input.title ?? null,
        slug: uniqueSlug(
          formatSessionFolderName(input.sessionDate),
          state.sessions.map((row) => row.slug),
        ),
        venueId,
        courtId,
        notes: input.notes ?? null,
        status: "draft",
        visibility: "private",
        driveFolderId: null,
        driveFolderUrl: null,
        createdBy: null,
        publishedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      state.sessions.push(session);
      persistState();
      return session;
    },

    async update(id, patch) {
      const state = getState();
      const session = requireEntity(
        state.sessions.find((row) => row.id === id),
        "Session",
        id,
      );
      const nextVenueId = patch.venueId !== undefined ? patch.venueId : session.venueId;
      const nextCourtId = patch.courtId !== undefined ? patch.courtId : session.courtId;
      assertCourtMatchesVenue(state, nextVenueId, nextCourtId);
      Object.assign(session, patch, {
        id: session.id,
        createdAt: session.createdAt,
        updatedAt: nowIso(),
      });
      persistState();
      return session;
    },

    async setRoster(id, playerIds) {
      const state = getState();
      requireEntity(
        state.sessions.find((row) => row.id === id),
        "Session",
        id,
      );
      state.sessionPlayers = state.sessionPlayers.filter((row) => row.sessionId !== id);
      const seen = new Set<string>();
      for (const playerId of playerIds) {
        if (seen.has(playerId)) continue;
        seen.add(playerId);
        state.sessionPlayers.push({ sessionId: id, playerId });
      }
      persistState();
    },
  };
}
