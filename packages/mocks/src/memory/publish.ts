import type { PublishRepository } from "../repositories/types";
import { getState, nowIso, requireEntity } from "../store";

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
      return session;
    },

    async unpublishSession(id) {
      const state = getState();
      const session = requireEntity(
        state.sessions.find((row) => row.id === id),
        "Session",
        id,
      );
      session.status = "ready";
      session.visibility = "private";
      session.publishedAt = null;
      session.updatedAt = nowIso();
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
      return game;
    },

    async unpublishGame(id) {
      const state = getState();
      const game = requireEntity(
        state.games.find((row) => row.id === id),
        "Game",
        id,
      );
      game.status = "ready";
      game.visibility = "private";
      game.publishedAt = null;
      game.updatedAt = nowIso();
      return game;
    },
  };
}
