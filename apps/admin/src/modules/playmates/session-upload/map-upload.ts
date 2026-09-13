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

export function recordingLabel(recording: SessionUploadRecording): string {
  const display = recording.displayName?.trim();
  return display || recording.originalFilename;
}

export function isIncompleteUploadStatus(status: UploadJobStatus): boolean {
  return status !== "completed";
}

export function hasIncompleteJobs(jobs: SessionUploadJob[]): boolean {
  return jobs.some((job) => isIncompleteUploadStatus(job.status));
}

function latestJob(
  jobs: SessionUploadJob[],
  recordingId: string,
  provider: Provider,
): SessionUploadJob | undefined {
  return jobs
    .filter((job) => job.recordingId === recordingId && job.provider === provider)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
}

function hasAsset(assets: SessionUploadAsset[], recordingId: string, provider: Provider): boolean {
  return assets.some((asset) => asset.recordingId === recordingId && asset.provider === provider);
}

export function toProviderStatus(
  provider: Provider,
  recordingId: string,
  jobs: SessionUploadJob[],
  assets: SessionUploadAsset[],
): UploadProviderStatusProps {
  const job = latestJob(jobs, recordingId, provider);
  if (job) {
    return {
      provider,
      status: job.status,
      progressPercent: job.progressPercent ?? undefined,
      errorMessage: job.lastErrorMessage ?? undefined,
    };
  }

  if (hasAsset(assets, recordingId, provider)) {
    return { provider, status: "completed", progressPercent: 100 };
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
