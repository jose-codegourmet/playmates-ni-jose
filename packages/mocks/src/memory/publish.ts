import type { PublishRepository } from "../repositories/types";
import { getState, nowIso, persistState, requireEntity } from "../store";

export function createPublishRepository(): PublishRepository {
  return {
    async publishSession(id) {
      const state = getState();
      const session = requireEntity(
        state.sessions.find((row) => row.id === id),
        "Session",
        id,
      );
      const now = nowIso();
      session.status = "published";
      session.visibility = "public";
      session.publishedAt = now;
      session.updatedAt = now;
      persistState();
      return session;
    },

    async unpublishSession(id) {
      const state = getState();
      const session = requireEntity(
        state.sessions.find((row) => row.id === id),
        "Session",
        id,
      );
      // Clear visibility only — keep publishedAt for audit (PNJ-074).
      session.visibility = "private";
      session.updatedAt = nowIso();
      persistState();
      return session;
    },

    async publishGame(id) {
      const state = getState();
      const game = requireEntity(
        state.games.find((row) => row.id === id),
        "Game",
        id,
      );
      const now = nowIso();
      game.status = "published";
      game.visibility = "public";
      game.publishedAt = now;
      game.updatedAt = now;
      persistState();
      return game;
    },

    async unpublishGame(id) {
      const state = getState();
      const game = requireEntity(
        state.games.find((row) => row.id === id),
        "Game",
        id,
      );
      // Clear visibility only — keep publishedAt for audit (PNJ-074).
      game.visibility = "private";
      game.updatedAt = nowIso();
      persistState();
      return game;
    },
  };
}
