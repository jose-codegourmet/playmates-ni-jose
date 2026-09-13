import type { Provider, UploadJobStatus } from "@fe-template/mocks";

export type SessionUploadRecording = {
  id: string;
  originalFilename: string;
  displayName: string | null;
  sizeBytes: number | null;
};

export type SessionUploadJob = {
  id: string;
  recordingId: string;
  provider: Provider;
  status: UploadJobStatus;
  progressPercent: number | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  updatedAt: string;
};

export type SessionUploadAsset = {
  recordingId: string;
  provider: Provider;
  url?: string | null;
};

export type SessionUploadProps = {
  sessionId: string;
  recordings: SessionUploadRecording[];
  jobs: SessionUploadJob[];
  assets: SessionUploadAsset[];
  onEnqueue?: (providers: Provider[]) => Promise<void> | void;
  /** Live pages poll `getJobs`. Stories should set false. */
  enableJobPolling?: boolean;
};
