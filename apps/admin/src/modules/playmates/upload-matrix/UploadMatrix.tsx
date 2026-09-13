import type { Provider, UploadJobStatus } from "@fe-template/mocks";
import {
  Button,
  Empty,
  EmptyHeader,
  EmptyTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fe-template/ui";

import type { UploadProviderStatusProps } from "../upload-provider-status/UploadProviderStatus.types";
import { UploadProviderStatus } from "../upload-provider-status/UploadProviderStatus";
import type { UploadMatrixProps, UploadMatrixRow } from "./UploadMatrix.types";

const RETRYABLE: readonly UploadJobStatus[] = ["failed", "cancelled"];
const CANCELLABLE: readonly UploadJobStatus[] = ["queued", "initiating", "uploading"];

type CellAction = { label: string; onClick: () => void };

function cellActions(
  cell: UploadProviderStatusProps,
  recordingId: string,
  provider: Provider,
  props: UploadMatrixProps,
): CellAction[] {
  const actions: CellAction[] = [];

  if (cell.status === "completed") {
    if (props.onReplace) {
      actions.push({
        label: "Replace…",
        onClick: () => props.onReplace?.(recordingId, provider),
      });
    }
    return actions;
  }

  if (cell.jobId && CANCELLABLE.includes(cell.status) && props.onCancelJob) {
    actions.push({
      label: "Cancel",
      onClick: () => props.onCancelJob?.(cell.jobId as string),
    });
  }

  if (cell.status === "failed" && props.onCopyError) {
    actions.push({
      label: "Copy error",
      onClick: () => props.onCopyError?.(cell.lastErrorCode, cell.errorMessage),
    });
  }

  if (cell.jobId && RETRYABLE.includes(cell.status) && props.onRetryJob) {
    actions.push({
      label: "Retry",
      onClick: () => props.onRetryJob?.(cell.jobId as string),
    });
  }

  if (!cell.jobId && props.onQueueRecording) {
    actions.push({
      label: provider === "youtube" ? "Queue YouTube" : "Queue Drive",
      onClick: () => props.onQueueRecording?.(recordingId, provider),
    });
  }

  return actions;
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
  const actions = cellActions(cell, recordingId, provider, matrix);

  return (
    <div className="flex flex-col items-start gap-2">
      <UploadProviderStatus {...cell} />
      {actions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant="outline"
              size="sm"
              disabled={matrix.busy}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function UploadMatrix(props: UploadMatrixProps) {
  const { rows } = props;

  if (rows.length === 0) {
    return (
      <Empty className="min-h-0 border p-4" data-slot="upload-matrix">
        <EmptyHeader>
          <EmptyTitle className="font-normal text-muted-foreground">
            No recordings in the upload matrix.
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

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
          {rows.map((row: UploadMatrixRow) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export type { UploadMatrixProps, UploadMatrixRow } from "./UploadMatrix.types";
export { UploadMatrix };
