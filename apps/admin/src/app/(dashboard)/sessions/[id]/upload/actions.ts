"use server";

import {
  ASSET_EXISTS,
  applyUploadSimulation,
  getState,
  isActiveUploadStatus,
  isMockDomainError,
  type Provider,
  type SessionStatus,
  type UploadJob,
} from "@fe-template/mocks";
import { revalidatePath } from "next/cache";

import { getPlaymatesRepos } from "@/lib/playmates";

export type QueueUploadsResult =
  | { success: true; queued: number; skippedExisting: number }
  | { success: false; error: string };

export type JobActionResult = { success: true } | { success: false; error: string };

export type UploadJobDto = {
  id: string;
  recordingId: string;
  provider: Provider;
  status: UploadJob["status"];
  progressPercent: number | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  updatedAt: string;
};

export type ProviderAssetDto = {
  recordingId: string;
  provider: Provider;
  url: string | null;
};

export type SessionJobsSnapshot = {
  jobs: UploadJobDto[];
  assets: ProviderAssetDto[];
  sessionStatus: SessionStatus | null;
};

/**
 * Replace this action body with resumable upload later — see ROADMAP/11.
 * These actions never accept or forward `File` bytes. Queue metadata and job ids only.
 */

function revalidateUploadPaths(sessionId: string) {
  revalidatePath("/sessions");
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath(`/sessions/${sessionId}/upload`);
  revalidatePath("/dashboard");
}

function toJobDto(job: UploadJob): UploadJobDto {
  return {
    id: job.id,
    recordingId: job.recordingId,
    provider: job.provider,
    status: job.status,
    progressPercent: job.progressPercent,
    lastErrorCode: job.lastErrorCode,
    lastErrorMessage: job.lastErrorMessage,
    updatedAt: job.updatedAt,
  };
}

function assetsForSession(sessionId: string): ProviderAssetDto[] {
  const state = getState();
  const recordingIds = new Set(
    state.recordings.filter((recording) => recording.sessionId === sessionId).map((row) => row.id),
  );
  return state.providerAssets
    .filter((asset) => recordingIds.has(asset.recordingId))
    .map((asset) => ({
      recordingId: asset.recordingId,
      provider: asset.provider,
      url: asset.url,
    }));
}

function sessionIdForRecording(recordingId: string): string | null {
  return getState().recordings.find((recording) => recording.id === recordingId)?.sessionId ?? null;
}

function sessionIdForJob(jobId: string): string | null {
  const job = getState().uploadJobs.find((row) => row.id === jobId);
  if (!job) return null;
  return sessionIdForRecording(job.recordingId);
}

async function syncSessionUploadStatus(sessionId: string): Promise<boolean> {
  const repos = getPlaymatesRepos();
  const detail = await repos.sessions.getById(sessionId);
  if (!detail) return false;

  const jobs = await repos.uploads.listBySession(sessionId);
  const active = jobs.some((job) => isActiveUploadStatus(job.status));
  const current = detail.session.status;
  if (current === "published" || current === "archived") return false;

  const next: SessionStatus = active ? "uploading" : jobs.length > 0 ? "ready" : current;
  if (next === current) return false;

  await repos.sessions.update(sessionId, { status: next });
  return true;
}

async function enqueueOne(
  recordingId: string,
  provider: Provider,
  options?: { replace?: boolean },
): Promise<"queued" | "skipped"> {
  try {
    await getPlaymatesRepos().uploads.enqueue(recordingId, provider, options);
    return "queued";
  } catch (error) {
    if (isMockDomainError(error) && error.code === ASSET_EXISTS) {
      return "skipped";
    }
    throw error;
  }
}

function failMessage(error: unknown, fallback: string): string {
  if (isMockDomainError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function queueRecording(input: {
  recordingId: string;
  provider: Provider;
  replace?: boolean;
}): Promise<QueueUploadsResult> {
  // Replace this action body with resumable upload later — see ROADMAP/11.
  applyUploadSimulation();

  const sessionId = sessionIdForRecording(input.recordingId);
  if (!sessionId) {
    return { success: false, error: "Recording not found" };
  }

  try {
    const outcome = await enqueueOne(input.recordingId, input.provider, {
      replace: input.replace,
    });
    const queued = outcome === "queued" ? 1 : 0;
    const skippedExisting = outcome === "skipped" ? 1 : 0;
    await syncSessionUploadStatus(sessionId);
    revalidateUploadPaths(sessionId);
    return { success: true, queued, skippedExisting };
  } catch (error) {
    return { success: false, error: failMessage(error, "Could not queue upload.") };
  }
}

export async function queueSession(input: {
  sessionId: string;
  providers: Provider[];
}): Promise<QueueUploadsResult> {
  // Replace this action body with resumable upload later — see ROADMAP/11.
  applyUploadSimulation();

  if (input.providers.length === 0) {
    return { success: false, error: "Choose at least one provider" };
  }

  try {
    const repos = getPlaymatesRepos();
    const session = await repos.sessions.getById(input.sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    const recordings = await repos.recordings.listBySession(input.sessionId);
    let queued = 0;
    let skippedExisting = 0;

    for (const recording of recordings) {
      for (const provider of input.providers) {
        const outcome = await enqueueOne(recording.id, provider);
        if (outcome === "queued") queued += 1;
        else skippedExisting += 1;
      }
    }

    await syncSessionUploadStatus(input.sessionId);
    revalidateUploadPaths(input.sessionId);
    return { success: true, queued, skippedExisting };
  } catch (error) {
    return { success: false, error: failMessage(error, "Could not queue uploads.") };
  }
}

export async function retryJob(jobId: string): Promise<JobActionResult> {
  // Replace this action body with resumable upload later — see ROADMAP/11.
  applyUploadSimulation();

  const sessionId = sessionIdForJob(jobId);
  if (!sessionId) {
    return { success: false, error: "Upload job not found" };
  }

  try {
    await getPlaymatesRepos().uploads.retry(jobId);
    await syncSessionUploadStatus(sessionId);
    revalidateUploadPaths(sessionId);
    return { success: true };
  } catch (error) {
    return { success: false, error: failMessage(error, "Could not retry upload.") };
  }
}

export async function cancelJob(jobId: string): Promise<JobActionResult> {
  // Replace this action body with resumable upload later — see ROADMAP/11.
  applyUploadSimulation();

  const sessionId = sessionIdForJob(jobId);
  if (!sessionId) {
    return { success: false, error: "Upload job not found" };
  }

  try {
    await getPlaymatesRepos().uploads.cancel(jobId);
    await syncSessionUploadStatus(sessionId);
    revalidateUploadPaths(sessionId);
    return { success: true };
  } catch (error) {
    return { success: false, error: failMessage(error, "Could not cancel upload.") };
  }
}

export async function getJobs(sessionId: string): Promise<SessionJobsSnapshot> {
  applyUploadSimulation();
  const repos = getPlaymatesRepos();
  const detail = await repos.sessions.getById(sessionId);
  if (!detail) {
    return { jobs: [], assets: [], sessionStatus: null };
  }

  const statusChanged = await syncSessionUploadStatus(sessionId);
  const jobs = await repos.uploads.listBySession(sessionId);
  const refreshed = await repos.sessions.getById(sessionId);

  if (statusChanged) {
    revalidateUploadPaths(sessionId);
  }

  return {
    jobs: jobs.map(toJobDto),
    assets: assetsForSession(sessionId),
    sessionStatus: refreshed?.session.status ?? detail.session.status,
  };
}
