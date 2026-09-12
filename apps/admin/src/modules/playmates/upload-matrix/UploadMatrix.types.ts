import type { UploadProviderStatusProps } from "../upload-provider-status/UploadProviderStatus.types";

export type UploadMatrixRow = {
  recordingLabel: string;
  drive: UploadProviderStatusProps;
  youtube: UploadProviderStatusProps;
};

export type UploadMatrixProps = {
  rows: UploadMatrixRow[];
};
