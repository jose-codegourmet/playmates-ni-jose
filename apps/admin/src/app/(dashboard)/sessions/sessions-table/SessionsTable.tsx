"use client";

import { formatSessionDisplayDate } from "@fe-template/mocks";
import {
  Button,
  DataTable,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo, useState } from "react";

import { StatusBadge, VisibilityBadge } from "@/modules/playmates/status-badge/StatusBadge";

import type { SessionRow, SessionStatusFilter, SessionsTableProps } from "./SessionsTable.types";

const STATUS_FILTERS: { value: SessionStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

function SessionsTable({ sessions }: SessionsTableProps) {
  const [statusFilter, setStatusFilter] = useState<SessionStatusFilter>("all");

  const visibleSessions = useMemo(() => {
    if (statusFilter === "all") return sessions;
    return sessions.filter((session) => session.status === statusFilter);
  }, [sessions, statusFilter]);

  const columns = useMemo<ColumnDef<SessionRow>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <time dateTime={row.original.date}>{formatSessionDisplayDate(row.original.date)}</time>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => row.original.title ?? "—",
      },
      {
        accessorKey: "venueName",
        header: "Venue",
        cell: ({ row }) => row.original.venueName ?? "—",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge kind="session" status={row.original.status} />,
      },
      {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => <VisibilityBadge visibility={row.original.visibility} />,
      },
      {
        accessorKey: "gameCount",
        header: "Games",
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            render={<Link href={`/sessions/${row.original.id}`} />}
          >
            Open
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Admin list includes private drafts. Open a row to enter the workspace.
          </p>
        </div>
        <Button render={<Link href="/sessions/new" />}>New session</Button>
      </div>

      <fieldset className="flex flex-wrap items-center gap-2 border-0 p-0">
        <legend className="sr-only">Filter sessions by status</legend>
        {STATUS_FILTERS.map((filter) => (
          <Button
            key={filter.value}
            type="button"
            size="sm"
            variant={statusFilter === filter.value ? "default" : "outline"}
            aria-pressed={statusFilter === filter.value}
            onClick={() => setStatusFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </fieldset>

      {visibleSessions.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No sessions</EmptyTitle>
            <EmptyDescription>
              {sessions.length === 0
                ? "Create a session to start organizing games."
                : "No sessions match this status filter."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <DataTable columns={columns} data={visibleSessions} pageSize={10} />
      )}
    </div>
  );
}

export type { SessionsTableProps };
export { SessionsTable };
