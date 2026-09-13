import {
  formatMatchup,
  type GameWithTeamsAndRecordings,
  type Provider,
  type ProviderAsset,
  type UploadJob,
  type UploadJobStatus,
} from "@fe-template/mocks";

import type { SessionPublishChecklistGame } from "../session-publish-checklist/SessionPublishChecklist.types";
import type { SessionReviewPublishGame } from "./SessionReviewPublish.types";

export const FACEBOOK_GENERATE_PLACEHOLDER = "Generate in next phase";

function teamNames(game: GameWithTeamsAndRecordings, teamNo: number): string[] {
  return (
    game.teams
      .find((team) => team.teamNo === teamNo)
      ?.players.map((player) => player.displayName) ?? []
  );
}

export function gameMatchupLabel(game: GameWithTeamsAndRecordings): string {
  return formatMatchup(teamNames(game, 1), teamNames(game, 2));
}

function latestJob(
  jobs: UploadJob[],
  recordingId: string,
  provider: Provider,
): UploadJob | undefined {
  return jobs
    .filter((job) => job.recordingId === recordingId && job.provider === provider)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
}

function hasAsset(
  assets: Pick<ProviderAsset, "recordingId" | "provider">[],
  recordingId: string,
  provider: Provider,
): boolean {
  return assets.some((asset) => asset.recordingId === recordingId && asset.provider === provider);
}

function recordingProviderStatus(
  recordingId: string,
  provider: Provider,
  jobs: UploadJob[],
  assets: Pick<ProviderAsset, "recordingId" | "provider">[],
): UploadJobStatus | null {
  const job = latestJob(jobs, recordingId, provider);
  if (job) return job.status;
  if (hasAsset(assets, recordingId, provider)) return "completed";
  return null;
}

/** Null when any recording in the game lacks that provider (checklist warning). */
export function gameProviderStatus(
  recordingIds: string[],
  provider: Provider,
  jobs: UploadJob[],
  assets: Pick<ProviderAsset, "recordingId" | "provider">[],
): UploadJobStatus | null {
  if (recordingIds.length === 0) return null;

  const statuses = recordingIds.map((recordingId) =>
    recordingProviderStatus(recordingId, provider, jobs, assets),
  );
  if (statuses.some((status) => status == null)) return null;

  const incomplete = statuses.find((status) => status !== "completed");
  return incomplete ?? "completed";
}

export function facebookPreviewBody(draftBody: string | null | undefined): string {
  const trimmed = draftBody?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : FACEBOOK_GENERATE_PLACEHOLDER;
}

export function toReviewPublishGames(
  games: GameWithTeamsAndRecordings[],
  jobs: UploadJob[],
  assets: Pick<ProviderAsset, "recordingId" | "provider">[],
  drafts: Map<string, { title: string | null; body: string }>,
): SessionReviewPublishGame[] {
  return games.map((game, index) => {
    const recordingIds = game.recordings.map((recording) => recording.id);
    const draft = drafts.get(game.id);
    const gameNumber = game.gameNumber ?? index + 1;
    return {
      id: game.id,
      gameNumber,
      matchup: gameMatchupLabel(game),
      youtubeStatus: gameProviderStatus(recordingIds, "youtube", jobs, assets),
      driveStatus: gameProviderStatus(recordingIds, "google_drive", jobs, assets),
      visibility: game.visibility,
      facebookTitle: draft?.title?.trim() || `Game ${gameNumber} Facebook draft`,
      facebookBody: facebookPreviewBody(draft?.body),
    };
  });
}

export function toChecklistGames(games: SessionReviewPublishGame[]): SessionPublishChecklistGame[] {
  return games.map((game) => ({
    id: game.id,
    gameNumber: game.gameNumber,
    matchup: game.matchup,
    youtubeStatus: game.youtubeStatus,
    driveStatus: game.driveStatus,
    visibility: game.visibility,
  }));
}
