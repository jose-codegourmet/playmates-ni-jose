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
  { recordingId: "rec-g1-a", provider: "google_drive" },
  { recordingId: "rec-g1-a", provider: "youtube" },
  { recordingId: "rec-g1-b", provider: "google_drive" },
  { recordingId: "rec-g1-b", provider: "youtube" },
  { recordingId: "rec-g8-a", provider: "google_drive" },
];

export const sep9CompletedFixture: SessionUploadProps = {
  sessionId: "session-sep-9",
  recordings: sep9Recordings,
  jobs: [],
  assets: completedAssets,
};

export const emptyUploadFixture: SessionUploadProps = {
  sessionId: "session-empty",
  recordings: [],
  jobs: [],
  assets: [],
};

const incompleteJobs: SessionUploadJob[] = [
  {
    id: "job-drive-uploading",
    recordingId: "rec-g1-a",
    provider: "google_drive",
    status: "uploading",
    progressPercent: 42,
    lastErrorMessage: null,
    updatedAt: "2026-09-13T04:00:00.000Z",
  },
  {
    id: "job-yt-failed",
    recordingId: "rec-g1-a",
    provider: "youtube",
    status: "failed",
    progressPercent: 10,
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
};
