import { GAME_HAS_RECORDINGS, MockDomainError } from "../errors";
import { formatGameSlug } from "../naming";
import type { GameRepository } from "../repositories/types";
import { getState, newId, nowIso, persistState, requireEntity } from "../store";
import type { Game, GameTeam } from "../types";

function ensureEmptyTeams(gameId: string): void {
  const state = getState();
  for (const teamNo of [1, 2] as const) {
    const existing = state.gameTeams.find(
      (team) => team.gameId === gameId && team.teamNo === teamNo,
    );
    if (!existing) {
      const team: GameTeam = { id: newId(), gameId, teamNo, label: null };
      state.gameTeams.push(team);
    }
  }
}

export function createGameRepository(): GameRepository {
  return {
    async listBySession(sessionId) {
      return getState()
        .games.filter((game) => game.sessionId === sessionId)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    },

    async getById(id) {
      return getState().games.find((game) => game.id === id) ?? null;
    },

    async getBySlug(slug) {
      const state = getState();
      for (const game of state.games) {
        if (game.gameNumber == null) continue;
        const session = state.sessions.find((row) => row.id === game.sessionId);
        if (!session) continue;
        if (formatGameSlug(session.sessionDate, game.gameNumber) === slug) {
          return game;
        }
      }
      return null;
    },

    async create(sessionId, input) {
      const state = getState();
      requireEntity(
        state.sessions.find((row) => row.id === sessionId),
        "Session",
        sessionId,
      );
      const siblings = state.games.filter((game) => game.sessionId === sessionId);
      const maxNumber = siblings.reduce((max, game) => Math.max(max, game.gameNumber ?? 0), 0);
      const gameNumber = input?.gameNumber ?? maxNumber + 1;
      const now = nowIso();
      const game: Game = {
        id: newId(),
        sessionId,
        gameNumber,
        sortOrder: gameNumber,
        title: null,
        notes: null,
        status: "draft",
        visibility: "private",
        winnerTeamNo: null,
        publishedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      state.games.push(game);
      ensureEmptyTeams(game.id);
      persistState();
      return game;
    },

    async delete(id) {
      const state = getState();
      requireEntity(
        state.games.find((row) => row.id === id),
        "Game",
        id,
      );
      const assigned = state.recordings.some((row) => row.gameId === id);
      if (assigned) {
        throw new MockDomainError(
          GAME_HAS_RECORDINGS,
          "Move recordings first before removing this game.",
        );
      }
      const teamIds = new Set(
        state.gameTeams.filter((team) => team.gameId === id).map((team) => team.id),
      );
      state.gameTeamPlayers = state.gameTeamPlayers.filter((row) => !teamIds.has(row.gameTeamId));
      state.gameTeams = state.gameTeams.filter((team) => team.gameId !== id);
      state.postDrafts = state.postDrafts.filter((draft) => draft.gameId !== id);
      state.games = state.games.filter((row) => row.id !== id);
      persistState();
    },

    async reorder(sessionId, gameIds) {
      const state = getState();
      const now = nowIso();
      gameIds.forEach((gameId, index) => {
        const game = state.games.find((row) => row.id === gameId && row.sessionId === sessionId);
        if (!game) return;
        game.sortOrder = index + 1;
        game.updatedAt = now;
      });
      persistState();
    },

    async setTeams(gameId, teams) {
      const state = getState();
      requireEntity(
        state.games.find((row) => row.id === gameId),
        "Game",
        gameId,
      );
      ensureEmptyTeams(gameId);
      const teamRows = state.gameTeams.filter((team) => team.gameId === gameId);
      const teamIds = new Set(teamRows.map((team) => team.id));
      state.gameTeamPlayers = state.gameTeamPlayers.filter((row) => !teamIds.has(row.gameTeamId));

      for (const incoming of teams) {
        let team = state.gameTeams.find(
          (row) => row.gameId === gameId && row.teamNo === incoming.teamNo,
        );
        if (!team) {
          team = { id: newId(), gameId, teamNo: incoming.teamNo, label: null };
          state.gameTeams.push(team);
        }
        incoming.playerIds.forEach((playerId, index) => {
          state.gameTeamPlayers.push({
            gameTeamId: team.id,
            playerId,
            sortOrder: index,
          });
        });
      }

      const game = state.games.find((row) => row.id === gameId);
      if (game) game.updatedAt = nowIso();
      persistState();
    },

    async update(id, patch) {
      const state = getState();
      const game = requireEntity(
        state.games.find((row) => row.id === id),
        "Game",
        id,
      );
      Object.assign(game, patch, {
        id: game.id,
        sessionId: game.sessionId,
        createdAt: game.createdAt,
        updatedAt: nowIso(),
      });
      persistState();
      return game;
    },
  };
}
