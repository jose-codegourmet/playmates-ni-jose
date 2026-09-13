import {
  formatFacebookBody,
  formatRecordingDisplayName,
  formatSessionDisplayDate,
} from "../naming";
import type { PostDraftRepository } from "../repositories/types";
import { getState, newId, nowIso, persistState, requireEntity } from "../store";
import type { PostDraft, Provider } from "../types";

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
  const recordings = state.recordings
    .filter((row) => row.gameId === gameId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const partCountBySide = recordings.reduce(
    (counts, recording) => {
      counts[recording.cameraSide] = (counts[recording.cameraSide] ?? 0) + 1;
      return counts;
    },
    {} as Record<string, number>,
  );

  const gameNumber = game.gameNumber ?? 0;

  function assetLines(provider: Provider): string[] {
    const lines: string[] = [];
    for (const recording of recordings) {
      const asset = state.providerAssets.find(
        (row) => row.recordingId === recording.id && row.provider === provider && row.url,
      );
      if (!asset?.url) continue;
      const label = formatRecordingDisplayName({
        gameNumber,
        side: recording.cameraSide,
        partNumber: recording.partNumber,
        partCount: partCountBySide[recording.cameraSide] ?? 1,
      });
      lines.push(`${label}: ${asset.url}`);
    }
    return lines;
  }

  const youtubeUrls = assetLines("youtube");
  const driveUrls = assetLines("google_drive");
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
        persistState();
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
      persistState();
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
      draft.version += 1;
      draft.updatedAt = nowIso();
      persistState();
      return draft;
    },

    async markPosted(id, url) {
      const state = getState();
      const draft = requireEntity(
        state.postDrafts.find((row) => row.id === id),
        "PostDraft",
        id,
      );
      const now = nowIso();
      draft.postedAt = draft.postedAt ?? now;
      const trimmed = url?.trim();
      if (trimmed) {
        draft.postedUrl = trimmed;
      } else if (url !== undefined) {
        delete draft.postedUrl;
      }
      draft.updatedAt = now;
      persistState();
      return draft;
    },

    async unmarkPosted(id) {
      const state = getState();
      const draft = requireEntity(
        state.postDrafts.find((row) => row.id === id),
        "PostDraft",
        id,
      );
      delete draft.postedAt;
      delete draft.postedUrl;
      draft.updatedAt = nowIso();
      persistState();
      return draft;
    },
  };
}
