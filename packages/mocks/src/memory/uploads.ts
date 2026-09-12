import type { UploadRepository } from "../repositories/types";
import { getState, newId, nowIso, requireEntity } from "../store";
import type { UploadJob, UploadJobStatus } from "../types";

const ACTIVE: UploadJobStatus[] = ["queued", "initiating", "uploading", "processing"];
const RETRYABLE: UploadJobStatus[] = ["failed", "cancelled"];
const CANCELLABLE: UploadJobStatus[] = ["queued", "initiating", "uploading"];

export function createUploadRepository(): UploadRepository {
  return {
    async enqueue(recordingId, provider) {
      const state = getState();
      const recording = requireEntity(
        state.recordings.find((row) => row.id === recordingId),
        "Recording",
        recordingId,
      );
      const existing = state.uploadJobs.find(
        (job) =>
          job.recordingId === recordingId &&
          job.provider === provider &&
          ACTIVE.includes(job.status),
      );
      if (existing) return existing;

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
        startedAt: null,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      state.uploadJobs.push(job);
      return job;
    },

    async retry(jobId) {
      const state = getState();
      const job = requireEntity(
        state.uploadJobs.find((row) => row.id === jobId),
        "UploadJob",
        jobId,
      );
      if (!RETRYABLE.includes(job.status)) {
        throw new Error(`Upload job ${jobId} cannot be retried from ${job.status}`);
      }
      job.status = "queued";
      job.progressPercent = 0;
      job.bytesUploaded = 0;
      job.attemptCount += 1;
      job.lastErrorCode = null;
      job.lastErrorMessage = null;
      job.startedAt = null;
      job.completedAt = null;
      job.updatedAt = nowIso();
      return job;
    },

    async cancel(jobId) {
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
      const state = getState();
      const recordingIds = new Set(
        state.recordings.filter((row) => row.sessionId === sessionId).map((row) => row.id),
      );
      return state.uploadJobs.filter((job) => recordingIds.has(job.recordingId));
    },
  };
}
