import type { Provider, SessionStatus, UploadJobStatus, Visibility } from "@fe-template/mocks";

import { getPlaymatesRepos } from "@/lib/playmates";

const TERMINAL_UPLOAD_STATUSES = new Set<UploadJobStatus>(["completed", "cancelled"]);

export type LatestSessionRow = {
  id: string;
  date: string;
  status: SessionStatus;
  visibility: Visibility;
};

export type UnfinishedUploadRow = {
  id: string;
  recordingLabel: string;
  provider: Provider;
  status: UploadJobStatus;
  sessionId: string;
};

export type FailedJobRow = {
  id: string;
  recordingLabel: string;
  provider: Provider;
  errorCode: string;
  sessionId: string;
};

export type AwaitingFacebookRow = {
  gameId: string;
  gameNumber: number | null;
  sessionId: string;
  sessionDate: string;
  title: string | null;
};

export type DashboardData = {
  latestSessions: LatestSessionRow[];
  unfinishedUploads: UnfinishedUploadRow[];
  failedJobs: FailedJobRow[];
  awaitingFacebook: AwaitingFacebookRow[];
};

function recordingLabel(
  recording: { displayName: string | null; originalFilename: string } | undefined,
  recordingId: string,
): string {
  return recording?.displayName ?? recording?.originalFilename ?? recordingId;
}

export async function getDashboardData(): Promise<DashboardData> {
  const repos = getPlaymatesRepos();
  const listed = await repos.sessions.list();

  const details = [];
  for (const item of listed) {
    if (!item.slug) continue;
    const detail = await repos.sessions.getBySlug(item.slug);
    if (detail) details.push(detail);
  }

  const latestSessions = details.slice(0, 5).map((detail) => ({
    id: detail.session.id,
    date: detail.session.sessionDate,
    status: detail.session.status,
    visibility: detail.session.visibility,
  }));

  const unfinishedUploads: UnfinishedUploadRow[] = [];
  const failedJobs: FailedJobRow[] = [];
  const awaitingFacebook: AwaitingFacebookRow[] = [];

  for (const detail of details) {
    const [jobs, recordings] = await Promise.all([
      repos.uploads.listBySession(detail.session.id),
      repos.recordings.listBySession(detail.session.id),
    ]);
    const recordingById = new Map(recordings.map((recording) => [recording.id, recording]));

    for (const job of jobs) {
      const label = recordingLabel(recordingById.get(job.recordingId), job.recordingId);
      if (!TERMINAL_UPLOAD_STATUSES.has(job.status)) {
        unfinishedUploads.push({
          id: job.id,
          recordingLabel: label,
          provider: job.provider,
          status: job.status,
          sessionId: detail.session.id,
        });
      }
      if (job.status === "failed") {
        failedJobs.push({
          id: job.id,
          recordingLabel: label,
          provider: job.provider,
          errorCode: job.lastErrorCode ?? "UNKNOWN",
          sessionId: detail.session.id,
        });
      }
    }

    for (const game of detail.games) {
      if (game.visibility !== "public") continue;
      const draft = await repos.posts.getByGame(game.id);
      // Seed drafts are unposted; `markPosted` does not persist a posted flag yet.
      if (!draft) continue;
      awaitingFacebook.push({
        gameId: game.id,
        gameNumber: game.gameNumber,
        sessionId: detail.session.id,
        sessionDate: detail.session.sessionDate,
        title: draft.title,
      });
    }
  }

  return { latestSessions, unfinishedUploads, failedJobs, awaitingFacebook };
}

export function formatProviderLabel(provider: Provider): string {
  return provider === "google_drive" ? "Google Drive" : "YouTube";
}
