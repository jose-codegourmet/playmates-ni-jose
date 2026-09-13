import type { UploadRepository } from "../repositories/types";
import { getState, newId, nowIso, requireEntity } from "../store";
import type { UploadJob, UploadJobStatus } from "../types";
import {
  applyUploadSimulation,
  archiveProviderAsset,
  assertCanEnqueue,
  findActiveJob,
  getJobView,
} from "../upload-simulator";

const RETRYABLE: UploadJobStatus[] = ["failed", "cancelled"];
const CANCELLABLE: UploadJobStatus[] = ["queued", "initiating", "uploading"];

export function createUploadRepository(): UploadRepository {
  return {
    async enqueue(recordingId, provider, options) {
      applyUploadSimulation();
      const state = getState();
      const recording = requireEntity(
        state.recordings.find((row) => row.id === recordingId),
        "Recording",
        recordingId,
      );
      const existing = findActiveJob(recordingId, provider);
      if (existing) return existing;

      if (options?.replace) {
        archiveProviderAsset(recordingId, provider);
      } else {
        assertCanEnqueue(recordingId, provider);
      }

      const now = nowIso();
      const job: UploadJob = {
        id: newId(),
        recordingId,
        provider,
        status: "queued",
        progressPercent: 0,
        bytesUploaded: 0,
        totalBytes: recording.sizeBytes,
        attemptCount: 1,
        resumableSessionRef: null,
        lastErrorCode: null,
        lastErrorMessage: null,
        startedAt: now,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      state.uploadJobs.push(job);
      return getJobView(job);
    },

    async retry(jobId) {
      applyUploadSimulation();
      const state = getState();
      const job = requireEntity(
        state.uploadJobs.find((row) => row.id === jobId),
        "UploadJob",
        jobId,
      );
      if (!RETRYABLE.includes(job.status)) {
        throw new Error(`Upload job ${jobId} cannot be retried from ${job.status}`);
      }
      const now = nowIso();
      job.status = "queued";
      job.progressPercent = 0;
      job.bytesUploaded = 0;
      job.attemptCount += 1;
      job.lastErrorCode = null;
      job.lastErrorMessage = null;
      job.startedAt = now;
      job.completedAt = null;
      job.updatedAt = now;
      return getJobView(job);
    },

    async cancel(jobId) {
      applyUploadSimulation();
      const state = getState();
      const job = requireEntity(
        state.uploadJobs.find((row) => row.id === jobId),
        "UploadJob",
        jobId,
      );
      if (!CANCELLABLE.includes(job.status)) {
        throw new Error(`Upload job ${jobId} cannot be cancelled from ${job.status}`);
      }
      job.status = "cancelled";
      job.updatedAt = nowIso();
      return job;
    },

    async listBySession(sessionId) {
      applyUploadSimulation();
      const state = getState();
      const recordingIds = new Set(
        state.recordings.filter((row) => row.sessionId === sessionId).map((row) => row.id),
      );
      return state.uploadJobs.filter((job) => recordingIds.has(job.recordingId));
    },
  };
}
