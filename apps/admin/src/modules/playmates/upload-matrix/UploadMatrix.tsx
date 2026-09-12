import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@fe-template/ui";

import { UploadProviderStatus } from "../upload-provider-status/UploadProviderStatus";
import type { UploadMatrixProps } from "./UploadMatrix.types";

function UploadMatrix({ rows }: UploadMatrixProps) {
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
            rows.map((row) => (
              <TableRow key={row.recordingLabel}>
                <TableCell className="align-top font-heading text-sm font-medium whitespace-normal">
                  {row.recordingLabel}
                </TableCell>
                <TableCell className="align-top whitespace-normal">
                  <UploadProviderStatus {...row.drive} />
                </TableCell>
                <TableCell className="align-top whitespace-normal">
                  <UploadProviderStatus {...row.youtube} />
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
