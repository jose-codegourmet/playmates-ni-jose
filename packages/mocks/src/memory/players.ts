import { slugify } from "../naming";
import type { PlayerRepository } from "../repositories/types";
import { getState, newId, nowIso, persistState, requireEntity, uniqueSlug } from "../store";
import type { Player } from "../types";

export function createPlayerRepository(): PlayerRepository {
  return {
    async list(opts) {
      const players = getState().players;
      if (opts?.includeArchived) return [...players];
      return players.filter((player) => !player.isArchived);
    },

    async getById(id) {
      return getState().players.find((player) => player.id === id) ?? null;
    },

    async getBySlug(slug) {
      return getState().players.find((player) => player.slug === slug) ?? null;
    },

    async create(input) {
      const state = getState();
      const now = nowIso();
      const base = slugify(input.displayName) || "player";
      const player: Player = {
        id: newId(),
        displayName: input.displayName,
        slug: uniqueSlug(
          base,
          state.players.map((row) => row.slug),
        ),
        nickname: input.nickname ?? null,
        facebookName: input.facebookName ?? null,
        facebookUrl: input.facebookUrl ?? null,
        notes: input.notes ?? null,
        isArchived: false,
        createdAt: now,
        updatedAt: now,
      };
      state.players.push(player);
      persistState();
      return player;
    },

    async update(id, patch) {
      const state = getState();
      const player = requireEntity(
        state.players.find((row) => row.id === id),
        "Player",
        id,
      );
      Object.assign(player, patch, {
        id: player.id,
        createdAt: player.createdAt,
        updatedAt: nowIso(),
      });
      persistState();
      return player;
    },

    async archive(id) {
      const state = getState();
      const player = requireEntity(
        state.players.find((row) => row.id === id),
        "Player",
        id,
      );
      player.isArchived = true;
      player.updatedAt = nowIso();
      persistState();
      return player;
    },
  };
}
