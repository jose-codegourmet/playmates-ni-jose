import type { Provider } from "@fe-template/mocks";

import type { UploadProviderStatusProps } from "../upload-provider-status/UploadProviderStatus.types";

export type UploadMatrixRow = {
  recordingId: string;
  recordingLabel: string;
  drive: UploadProviderStatusProps;
  youtube: UploadProviderStatusProps;
};

export type UploadMatrixProps = {
  rows: UploadMatrixRow[];
  busy?: boolean;
  onQueueRecording?: (recordingId: string, provider: Provider) => void;
  onRetryJob?: (jobId: string) => void;
  onCancelJob?: (jobId: string) => void;
  onReplace?: (recordingId: string, provider: Provider) => void;
  onCopyError?: (errorCode: string | undefined, errorMessage: string | undefined) => void;
};
