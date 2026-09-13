import type { Provider, UploadJobStatus } from "@fe-template/mocks";

export type UploadProviderStatusProps = {
  provider: Provider;
  status: UploadJobStatus;
  progressPercent?: number;
  errorMessage?: string;
  lastErrorCode?: string;
  jobId?: string;
  assetUrl?: string;
};
