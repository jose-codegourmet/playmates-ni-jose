import type { Provider, UploadJobStatus } from "@fe-template/mocks";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@fe-template/ui";

import type { UploadProviderStatusProps } from "../upload-provider-status/UploadProviderStatus.types";
import { UploadProviderStatus } from "../upload-provider-status/UploadProviderStatus";
import type { UploadMatrixProps, UploadMatrixRow } from "./UploadMatrix.types";

const RETRYABLE: readonly UploadJobStatus[] = ["failed", "cancelled"];
const CANCELLABLE: readonly UploadJobStatus[] = ["queued", "initiating", "uploading"];

function cellAction(
  cell: UploadProviderStatusProps,
  recordingId: string,
  provider: Provider,
  props: UploadMatrixProps,
): { label: string; onClick: () => void } | null {
  if (cell.status === "completed") return null;

  if (cell.jobId && CANCELLABLE.includes(cell.status) && props.onCancelJob) {
    return { label: "Cancel", onClick: () => props.onCancelJob?.(cell.jobId as string) };
  }

  if (cell.jobId && RETRYABLE.includes(cell.status) && props.onRetryJob) {
    return { label: "Retry", onClick: () => props.onRetryJob?.(cell.jobId as string) };
  }

  if (!cell.jobId && props.onQueueRecording) {
    return {
      label: provider === "youtube" ? "Queue YouTube" : "Queue Drive",
      onClick: () => props.onQueueRecording?.(recordingId, provider),
    };
  }

  return null;
}

function ProviderCell({
  cell,
  recordingId,
  provider,
  matrix,
}: {
  cell: UploadProviderStatusProps;
  recordingId: string;
  provider: Provider;
  matrix: UploadMatrixProps;
}) {
  const action = cellAction(cell, recordingId, provider, matrix);

  return (
    <div className="flex flex-col items-start gap-2">
      <UploadProviderStatus {...cell} />
      {action ? (
        <Button type="button" variant="outline" size="sm" disabled={matrix.busy} onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

function UploadMatrix(props: UploadMatrixProps) {
  const { rows } = props;

  return (
    <div
      data-slot="upload-matrix"
      className="w-full overflow-hidden rounded-md border bg-background text-foreground"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Recording</TableHead>
            <TableHead>Drive</TableHead>
            <TableHead>YouTube</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                No recordings in the upload matrix.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row: UploadMatrixRow) => (
              <TableRow key={row.recordingId}>
                <TableCell className="align-top font-heading text-sm font-medium whitespace-normal">
                  {row.recordingLabel}
                </TableCell>
                <TableCell className="align-top whitespace-normal">
                  <ProviderCell
                    cell={row.drive}
                    recordingId={row.recordingId}
                    provider="google_drive"
                    matrix={props}
                  />
                </TableCell>
                <TableCell className="align-top whitespace-normal">
                  <ProviderCell
                    cell={row.youtube}
                    recordingId={row.recordingId}
                    provider="youtube"
                    matrix={props}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export type { UploadMatrixProps, UploadMatrixRow } from "./UploadMatrix.types";
export { UploadMatrix };
