import type { Provider, UploadJobStatus } from "@fe-template/mocks";
import { Progress, ProgressLabel, ProgressValue } from "@fe-template/ui";

import { StatusBadge } from "../status-badge/StatusBadge";
import type { UploadProviderStatusProps } from "./UploadProviderStatus.types";

const PROVIDER_LABEL: Record<Provider, string> = {
  google_drive: "Google Drive",
  youtube: "YouTube",
};

function showsProgress(status: UploadJobStatus): boolean {
  return status === "uploading" || status === "processing";
}

function clampProgress(progressPercent: number | undefined): number | undefined {
  if (progressPercent === undefined) {
    return undefined;
  }

  return Math.min(100, Math.max(0, progressPercent));
}

function UploadProviderStatus({
  provider,
  status,
  progressPercent,
  errorMessage,
}: UploadProviderStatusProps) {
  const value = clampProgress(progressPercent);
  const failedMessage = status === "failed" ? errorMessage?.trim() || "Upload failed" : undefined;

  return (
    <div className="flex min-w-0 flex-col gap-1.5 text-foreground">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-heading text-sm font-medium leading-snug">{PROVIDER_LABEL[provider]}</p>
        <StatusBadge kind="upload-job" status={status} />
      </div>
      {showsProgress(status) ? (
        <Progress value={value ?? null} className="max-w-xs">
          <ProgressLabel>{status === "processing" ? "Processing" : "Uploading"}</ProgressLabel>
          <ProgressValue />
        </Progress>
      ) : null}
      {failedMessage ? <p className="text-sm text-destructive">{failedMessage}</p> : null}
    </div>
  );
}

export type { UploadProviderStatusProps };
export { UploadProviderStatus };
