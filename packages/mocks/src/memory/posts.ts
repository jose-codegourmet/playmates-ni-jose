import { formatFacebookBody, formatSessionDisplayDate } from "../naming";
import type { PostDraftRepository } from "../repositories/types";
import { getState, newId, nowIso, requireEntity } from "../store";
import type { PostDraft } from "../types";

function teamNames(gameId: string, teamNo: number): string[] {
  const state = getState();
  const team = state.gameTeams.find((row) => row.gameId === gameId && row.teamNo === teamNo);
  if (!team) return [];
  return state.gameTeamPlayers
    .filter((row) => row.gameTeamId === team.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((row) => state.players.find((player) => player.id === row.playerId)?.displayName)
    .filter((name): name is string => Boolean(name));
}

function draftBody(gameId: string): { title: string; body: string } {
  const state = getState();
  const game = requireEntity(
    state.games.find((row) => row.id === gameId),
    "Game",
    gameId,
  );
  const session = requireEntity(
    state.sessions.find((row) => row.id === game.sessionId),
    "Session",
    game.sessionId,
  );
  const recordingIds = state.recordings.filter((row) => row.gameId === gameId).map((row) => row.id);
  const assets = state.providerAssets.filter((asset) => recordingIds.includes(asset.recordingId));
  const youtubeUrls = assets
    .filter((asset) => asset.provider === "youtube" && asset.url)
    .map((asset) => asset.url as string);
  const driveUrls = assets
    .filter((asset) => asset.provider === "google_drive" && asset.url)
    .map((asset) => asset.url as string);
  const gameNumber = game.gameNumber ?? 0;
  const body = formatFacebookBody({
    date: session.sessionDate,
    gameNumber,
    team1: teamNames(gameId, 1),
    team2: teamNames(gameId, 2),
    youtubeUrls,
    driveUrls,
    notes: game.notes,
    hashtags: state.settings.defaultHashtags,
  });
  const title = `${formatSessionDisplayDate(session.sessionDate)} | Game ${gameNumber}`;
  return { title, body };
}

export function createPostDraftRepository(): PostDraftRepository {
  return {
    async getByGame(gameId) {
      return getState().postDrafts.find((draft) => draft.gameId === gameId) ?? null;
    },

    async generate(gameId) {
      const state = getState();
      requireEntity(
        state.games.find((row) => row.id === gameId),
        "Game",
        gameId,
      );
      const now = nowIso();
      const { title, body } = draftBody(gameId);
      const existing = state.postDrafts.find((draft) => draft.gameId === gameId);
      if (existing) {
        existing.title = title;
        existing.body = body;
        existing.version += 1;
        existing.updatedAt = now;
        return existing;
      }
      const draft: PostDraft = {
        id: newId(),
        gameId,
        platform: "facebook_group",
        title,
        body,
        version: 1,
        createdAt: now,
        updatedAt: now,
      };
      state.postDrafts.push(draft);
      return draft;
    },

    async update(id, body) {
      const state = getState();
      const draft = requireEntity(
        state.postDrafts.find((row) => row.id === id),
        "PostDraft",
        id,
      );
      draft.body = body;
      draft.updatedAt = nowIso();
      return draft;
    },

    async markPosted(id) {
      const state = getState();
      const draft = requireEntity(
        state.postDrafts.find((row) => row.id === id),
        "PostDraft",
        id,
      );
      draft.updatedAt = nowIso();
      return draft;
    },
  };
}
