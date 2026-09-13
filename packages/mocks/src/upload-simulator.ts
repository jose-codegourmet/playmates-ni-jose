/**
 * Time-based fake upload simulator (PNJ-017).
 *
 * Progress is derived from `startedAt` + elapsed wall time — no `setInterval`.
 * Server Components / actions poll via repo reads; serverless instances do not
 * keep a background ticker.
 *
 * This package never reads `File` bytes. A client-only `sourceHandlePresent`
 * map is **not** stored here. After a refresh the admin UI should show the
 * reselect banner (PNJ-063 / PNJ-072). Upload actions still run this simulator
 * as prototype convenience; do not pretend the server still has the file.
 */

import { assetExistsError, MOCK_PROVIDER_ERROR } from "./errors";
import { getState, newId, persistState } from "./store";
import type { Provider, ProviderAsset, Recording, UploadJob, UploadJobStatus } from "./types";

const ACTIVE: UploadJobStatus[] = ["queued", "initiating", "uploading", "processing"];
const MIN_DURATION_MS = 2500;
const MAX_DURATION_MS = 6000;
const INITIATING_MS = 50;
const PROCESSING_MS = 400;

export function isActiveUploadStatus(status: UploadJobStatus): boolean {
  return ACTIVE.includes(status);
}

/** 2500–6000 ms from sizeBytes so many files do not finish in one paint. */
export function simulatedDurationMs(sizeBytes: number | null | undefined): number {
  const n = Math.abs(sizeBytes ?? 0) >>> 0;
  const span = MAX_DURATION_MS - MIN_DURATION_MS;
  return MIN_DURATION_MS + (n % (span + 1));
}

/**
 * First YouTube attempt fails when the filename contains `FAIL` or notes are
 * `force-fail-youtube`. Drive is never force-failed. Retry succeeds when
 * `attemptCount > 1`.
 */
export function shouldForceFail(
  recording: Recording,
  provider: Provider,
  attemptCount = 1,
): boolean {
  if (attemptCount > 1) return false;
  if (provider !== "youtube") return false;
  if (recording.originalFilename.includes("FAIL")) return true;
  return recording.notes === "force-fail-youtube";
}

function mockHex8(seed: string): string {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(-8);
}

/** Reserved mock YouTube id: `MOCK` + 8 hex chars. */
export function mockYoutubeVideoId(seed: string): string {
  return `MOCK${mockHex8(seed)}`;
}

function findAsset(recordingId: string, provider: Provider): ProviderAsset | undefined {
  return getState().providerAssets.find(
    (asset) => asset.recordingId === recordingId && asset.provider === provider,
  );
}

function findCompletedJob(recordingId: string, provider: Provider): UploadJob | undefined {
  return getState().uploadJobs.find(
    (job) =>
      job.recordingId === recordingId && job.provider === provider && job.status === "completed",
  );
}

export function assertCanEnqueue(recordingId: string, provider: Provider): void {
  const asset = findAsset(recordingId, provider);
  const completed = findCompletedJob(recordingId, provider);
  if (completed && asset) {
    throw assetExistsError(recordingId, provider);
  }
}

/** Mock archive: drop the prior asset so a replace job can create a new one. */
export function archiveProviderAsset(recordingId: string, provider: Provider): void {
  const state = getState();
  state.providerAssets = state.providerAssets.filter(
    (asset) => !(asset.recordingId === recordingId && asset.provider === provider),
  );
  persistState();
}

function createProviderAsset(job: UploadJob, recording: Recording, now: string): ProviderAsset {
  const seed = `${job.id}:${job.attemptCount}`;
  const hex = mockHex8(seed);
  const youtubeId = mockYoutubeVideoId(seed);
  const driveId = `drv-mock-${hex}`;
  const isYoutube = job.provider === "youtube";
  const asset: ProviderAsset = {
    id: newId(),
    recordingId: job.recordingId,
    provider: job.provider,
    providerAssetId: isYoutube ? youtubeId : driveId,
    providerParentId: null,
    url: isYoutube
      ? `https://www.youtube.com/watch?v=${youtubeId}`
      : `https://example.com/drive/${driveId}`,
    embedUrl: isYoutube ? `https://www.youtube.com/embed/${youtubeId}` : null,
    privacy: "unlisted",
    title: recording.displayName ?? recording.originalFilename,
    description: null,
    metadata: { mock: true, jobId: job.id },
    status: "created",
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  getState().providerAssets.push(asset);
  return asset;
}

function markFailed(job: UploadJob, now: string): void {
  job.status = "failed";
  job.progressPercent = job.progressPercent ?? 0;
  job.lastErrorCode = MOCK_PROVIDER_ERROR;
  job.lastErrorMessage = "Mock provider rejected the upload (force-fail).";
  job.completedAt = now;
  job.updatedAt = now;
}

function markCompleted(job: UploadJob, recording: Recording, now: string): void {
  job.status = "completed";
  job.progressPercent = 100;
  job.bytesUploaded = job.totalBytes;
  job.lastErrorCode = null;
  job.lastErrorMessage = null;
  job.completedAt = now;
  job.updatedAt = now;
  if (!findAsset(job.recordingId, job.provider)) {
    createProviderAsset(job, recording, now);
  }
}

/**
 * Advance one job from `startedAt` + elapsed. Mutates the store row.
 * Terminal statuses (`completed|failed|cancelled`) are left unchanged.
 */
export function getJobView(job: UploadJob, nowMs: number = Date.now()): UploadJob {
  if (job.status === "completed" || job.status === "failed" || job.status === "cancelled") {
    return job;
  }

  const state = getState();
  const recording = state.recordings.find((row) => row.id === job.recordingId);
  if (!recording) return job;

  if (!job.startedAt) {
    job.startedAt = new Date(nowMs).toISOString();
    job.status = "initiating";
    job.updatedAt = job.startedAt;
  }

  const startedMs = Date.parse(job.startedAt);
  const elapsed = Math.max(0, nowMs - startedMs);
  const duration = simulatedDurationMs(recording.sizeBytes ?? job.totalBytes);
  const forceFail = shouldForceFail(recording, job.provider, job.attemptCount);
  const now = new Date(nowMs).toISOString();

  if (elapsed < INITIATING_MS) {
    job.status = "initiating";
    job.progressPercent = 0;
    job.bytesUploaded = 0;
    job.updatedAt = now;
    return job;
  }

  if (elapsed < duration) {
    const uploadElapsed = elapsed - INITIATING_MS;
    const uploadWindow = Math.max(1, duration - INITIATING_MS);
    const progress = Math.min(99, Math.floor((uploadElapsed / uploadWindow) * 100));
    job.status = "uploading";
    job.progressPercent = progress;
    const total = job.totalBytes ?? 0;
    job.bytesUploaded = Math.floor((progress / 100) * total);
    job.updatedAt = now;
    return job;
  }

  if (elapsed < duration + PROCESSING_MS) {
    job.status = "processing";
    job.progressPercent = 99;
    job.bytesUploaded = job.totalBytes;
    job.updatedAt = now;
    return job;
  }

  if (forceFail) {
    markFailed(job, now);
    return job;
  }

  markCompleted(job, recording, now);
  return job;
}

/** Advance every job in the singleton (safe to call on each repo read). */
export function applyUploadSimulation(nowMs: number = Date.now()): void {
  const jobs = getState().uploadJobs;
  const before = jobs.map((job) => `${job.status}:${job.updatedAt}:${job.progressPercent}`).join("|");
  for (const job of jobs) {
    getJobView(job, nowMs);
  }
  const after = jobs.map((job) => `${job.status}:${job.updatedAt}:${job.progressPercent}`).join("|");
  if (before !== after) {
    persistState();
  }
}

export function findActiveJob(recordingId: string, provider: Provider): UploadJob | undefined {
  applyUploadSimulation();
  return getState().uploadJobs.find(
    (job) =>
      job.recordingId === recordingId &&
      job.provider === provider &&
      isActiveUploadStatus(job.status),
  );
}
