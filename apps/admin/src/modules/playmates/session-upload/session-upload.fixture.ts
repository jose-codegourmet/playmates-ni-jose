import type {
  SessionUploadAsset,
  SessionUploadJob,
  SessionUploadProps,
  SessionUploadRecording,
} from "./SessionUpload.types";

const sep9Recordings: SessionUploadRecording[] = [
  {
    id: "rec-g1-a",
    originalFilename: "IMG_1001.MOV",
    displayName: "Sep 9 | Game 1 | Side A",
    sizeBytes: 80_001_000,
  },
  {
    id: "rec-g1-b",
    originalFilename: "IMG_1002.MOV",
    displayName: "Sep 9 | Game 1 | Side B",
    sizeBytes: 80_002_000,
  },
  {
    id: "rec-g8-a",
    originalFilename: "IMG_1010.MOV",
    displayName: "Sep 9 | Game 8 | Side A",
    sizeBytes: 80_010_000,
  },
];

const completedAssets: SessionUploadAsset[] = [
  { recordingId: "rec-g1-a", provider: "google_drive", url: "https://example.com/drive/drv-mock-g1a" },
  { recordingId: "rec-g1-a", provider: "youtube", url: "https://www.youtube.com/watch?v=MOCK11111111" },
  { recordingId: "rec-g1-b", provider: "google_drive", url: "https://example.com/drive/drv-mock-g1b" },
  { recordingId: "rec-g1-b", provider: "youtube", url: "https://www.youtube.com/watch?v=MOCK22222222" },
  { recordingId: "rec-g8-a", provider: "google_drive", url: "https://example.com/drive/drv-mock-g8a" },
];

export const sep9CompletedFixture: SessionUploadProps = {
  sessionId: "session-sep-9",
  recordings: sep9Recordings,
  jobs: [],
  assets: completedAssets,
  enableJobPolling: false,
};

export const emptyUploadFixture: SessionUploadProps = {
  sessionId: "session-empty",
  recordings: [],
  jobs: [],
  assets: [],
  enableJobPolling: false,
};

const incompleteJobs: SessionUploadJob[] = [
  {
    id: "job-drive-uploading",
    recordingId: "rec-g1-a",
    provider: "google_drive",
    status: "uploading",
    progressPercent: 42,
    lastErrorCode: null,
    lastErrorMessage: null,
    updatedAt: "2026-09-13T04:00:00.000Z",
  },
  {
    id: "job-yt-failed",
    recordingId: "rec-g1-a",
    provider: "youtube",
    status: "failed",
    progressPercent: 10,
    lastErrorCode: "MOCK_PROVIDER_ERROR",
    lastErrorMessage: "Mock provider rejected the upload (force-fail).",
    updatedAt: "2026-09-13T04:01:00.000Z",
  },
];

const draftRecording = sep9Recordings[0] ?? {
  id: "rec-g1-a",
  originalFilename: "IMG_1001.MOV",
  displayName: "Sep 9 | Game 1 | Side A",
  sizeBytes: 80_001_000,
};

export const incompleteJobsFixture: SessionUploadProps = {
  sessionId: "session-draft",
  recordings: [draftRecording],
  jobs: incompleteJobs,
  assets: [],
  enableJobPolling: false,
};
