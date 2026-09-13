import type { Provider, UploadJobStatus } from "@fe-template/mocks";

import type { UploadMatrixRow } from "../upload-matrix/UploadMatrix.types";
import type { UploadProviderStatusProps } from "../upload-provider-status/UploadProviderStatus.types";
import type { UploadQueueItem } from "../upload-queue/UploadQueue.types";
import type {
  SessionUploadAsset,
  SessionUploadJob,
  SessionUploadRecording,
} from "./SessionUpload.types";

const PROVIDERS = ["google_drive", "youtube"] as const satisfies readonly Provider[];

const ACTIVE_UPLOAD_STATUSES: readonly UploadJobStatus[] = [
  "queued",
  "initiating",
  "uploading",
  "processing",
];

export function recordingLabel(recording: SessionUploadRecording): string {
  const display = recording.displayName?.trim();
  return display || recording.originalFilename;
}

export function isActiveUploadStatus(status: UploadJobStatus): boolean {
  return ACTIVE_UPLOAD_STATUSES.includes(status);
}

export function isIncompleteUploadStatus(status: UploadJobStatus): boolean {
  return status !== "completed";
}

export function hasIncompleteJobs(jobs: SessionUploadJob[]): boolean {
  return jobs.some((job) => isIncompleteUploadStatus(job.status));
}

export function hasActiveUploadJobs(jobs: SessionUploadJob[]): boolean {
  return jobs.some((job) => isActiveUploadStatus(job.status));
}

export function latestJob(
  jobs: SessionUploadJob[],
  recordingId: string,
  provider: Provider,
): SessionUploadJob | undefined {
  return jobs
    .filter((job) => job.recordingId === recordingId && job.provider === provider)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
}

export function findAsset(
  assets: SessionUploadAsset[],
  recordingId: string,
  provider: Provider,
): SessionUploadAsset | undefined {
  return assets.find((asset) => asset.recordingId === recordingId && asset.provider === provider);
}

export function isProviderMissing(
  recordingId: string,
  provider: Provider,
  jobs: SessionUploadJob[],
  assets: SessionUploadAsset[],
): boolean {
  if (findAsset(assets, recordingId, provider)) return false;
  const job = latestJob(jobs, recordingId, provider);
  if (!job) return true;
  if (isActiveUploadStatus(job.status)) return false;
  return job.status !== "completed";
}

export function missingProvidersForRecording(
  recordingId: string,
  jobs: SessionUploadJob[],
  assets: SessionUploadAsset[],
): Provider[] {
  return PROVIDERS.filter((provider) => isProviderMissing(recordingId, provider, jobs, assets));
}

export function hasMissingUploads(
  recordings: SessionUploadRecording[],
  jobs: SessionUploadJob[],
  assets: SessionUploadAsset[],
): boolean {
  return recordings.some(
    (recording) => missingProvidersForRecording(recording.id, jobs, assets).length > 0,
  );
}

export function toProviderStatus(
  provider: Provider,
  recordingId: string,
  jobs: SessionUploadJob[],
  assets: SessionUploadAsset[],
): UploadProviderStatusProps {
  const job = latestJob(jobs, recordingId, provider);
  const asset = findAsset(assets, recordingId, provider);
  if (job) {
    return {
      provider,
      status: job.status,
      progressPercent: job.progressPercent ?? undefined,
      errorMessage: job.lastErrorMessage ?? undefined,
      lastErrorCode: job.lastErrorCode ?? undefined,
      jobId: job.id,
      assetUrl: asset?.url ?? undefined,
    };
  }

  if (asset) {
    return {
      provider,
      status: "completed",
      progressPercent: 100,
      assetUrl: asset.url ?? undefined,
    };
  }

  return { provider, status: "queued" };
}

function rowForRecording(
  recording: SessionUploadRecording,
  jobs: SessionUploadJob[],
  assets: SessionUploadAsset[],
  usedLabels: Set<string>,
): UploadMatrixRow {
  let label = recordingLabel(recording);
  if (usedLabels.has(label)) {
    label = `${label} · ${recording.originalFilename}`;
  }
  usedLabels.add(label);

  return {
    recordingId: recording.id,
    recordingLabel: label,
    drive: toProviderStatus("google_drive", recording.id, jobs, assets),
    youtube: toProviderStatus("youtube", recording.id, jobs, assets),
  };
}

export function toUploadMatrixRows(
  recordings: SessionUploadRecording[],
  jobs: SessionUploadJob[],
  assets: SessionUploadAsset[],
): UploadMatrixRow[] {
  const usedLabels = new Set<string>();
  return recordings.map((recording) => rowForRecording(recording, jobs, assets, usedLabels));
}

export function toUploadQueueItems(
  recordings: SessionUploadRecording[],
  jobs: SessionUploadJob[],
  assets: SessionUploadAsset[],
): UploadQueueItem[] {
  const recordingIdsWithJobs = new Set(jobs.map((job) => job.recordingId));
  const usedLabels = new Set<string>();
  return recordings
    .filter((recording) => recordingIdsWithJobs.has(recording.id))
    .map((recording) => {
      const row = rowForRecording(recording, jobs, assets, usedLabels);
      return {
        recordingLabel: row.recordingLabel,
        drive: row.drive,
        youtube: row.youtube,
      };
    });
}

export { PROVIDERS };
