import type { UploadProviderStatusProps } from "../upload-provider-status/UploadProviderStatus.types";

export type UploadQueueItem = {
  recordingLabel: string;
  drive: UploadProviderStatusProps;
  youtube: UploadProviderStatusProps;
};

export type UploadQueueProps = {
  items: UploadQueueItem[];
};
