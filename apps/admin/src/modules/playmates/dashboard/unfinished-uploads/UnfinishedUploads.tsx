import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@fe-template/ui";
import Link from "next/link";

import { StatusBadge } from "../../status-badge/StatusBadge";
import { formatProviderLabel } from "../get-dashboard-data";
import type { UnfinishedUploadsProps } from "./UnfinishedUploads.types";

function UnfinishedUploads({ rows }: UnfinishedUploadsProps) {
  return (
    <Card size="sm" data-slot="unfinished-uploads" className="gap-0 bg-background text-foreground">
      <CardHeader className="border-b border-border px-(--card-spacing) py-3">
        <CardTitle>Unfinished uploads</CardTitle>
      </CardHeader>
      <CardContent className="px-(--card-spacing) py-3">
        {rows.length === 0 ? (
          <Empty className="min-h-0 p-4">
            <EmptyHeader>
              <EmptyTitle className="font-normal text-muted-foreground">
                All uploads finished
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((row) => (
              <li key={row.id} className="flex min-w-0 flex-col gap-1">
                <Link
                  href={`/sessions/${row.sessionId}`}
                  className="font-heading text-sm font-medium leading-snug text-primary underline-offset-4 hover:underline"
                >
                  {row.recordingLabel}
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {formatProviderLabel(row.provider)}
                  </p>
                  <StatusBadge kind="upload-job" status={row.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export type { UnfinishedUploadsProps };
export { UnfinishedUploads };
