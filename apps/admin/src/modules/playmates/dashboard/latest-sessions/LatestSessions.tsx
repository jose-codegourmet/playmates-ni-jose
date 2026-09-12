import { formatSessionDisplayDate } from "@fe-template/mocks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import Link from "next/link";

import { StatusBadge, VisibilityBadge } from "../../status-badge/StatusBadge";
import type { LatestSessionsProps } from "./LatestSessions.types";

function LatestSessions({ rows }: LatestSessionsProps) {
  return (
    <Card size="sm" data-slot="latest-sessions" className="gap-0 bg-background text-foreground">
      <CardHeader className="border-b border-border px-(--card-spacing) py-3">
        <CardTitle>Latest sessions</CardTitle>
      </CardHeader>
      <CardContent className="px-(--card-spacing) py-3">
        {rows.length === 0 ? (
          <Empty className="min-h-0 p-4">
            <EmptyHeader>
              <EmptyTitle className="font-normal text-muted-foreground">No sessions yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="text-right">Workspace</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <time dateTime={row.date}>{formatSessionDisplayDate(row.date)}</time>
                  </TableCell>
                  <TableCell>
                    <StatusBadge kind="session" status={row.status} />
                  </TableCell>
                  <TableCell>
                    <VisibilityBadge visibility={row.visibility} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/sessions/${row.id}`}
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Open
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export type { LatestSessionsProps };
export { LatestSessions };
