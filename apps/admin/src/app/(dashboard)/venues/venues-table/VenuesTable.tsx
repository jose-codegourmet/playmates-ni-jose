"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  DataTable,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Input,
  Label,
  Switch,
} from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { ArchiveIcon, PencilIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { archiveVenue } from "../actions";
import { VenuesDialog } from "../venues-dialog/VenuesDialog";
import type { VenueRow, VenuesTableProps } from "./VenuesTable.types";

function matchesSearch(venue: VenueRow, query: string) {
  if (!query) return true;
  const haystack = [venue.name, venue.slug, venue.address]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function VenuesTable({ venues }: VenuesTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<VenueRow | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<VenueRow | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const visibleVenues = useMemo(() => {
    const query = search.trim().toLowerCase();
    return venues.filter((venue) => {
      if (!showArchived && venue.isArchived) return false;
      return matchesSearch(venue, query);
    });
  }, [venues, search, showArchived]);

  function openCreate() {
    setEditingVenue(null);
    setDialogOpen(true);
  }

  async function confirmArchive() {
    if (!archiveTarget) return;
    setIsArchiving(true);
    const result = await archiveVenue(archiveTarget.id);
    setIsArchiving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    setArchiveTarget(null);
    router.refresh();
  }

  const columns = useMemo<ColumnDef<VenueRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link
            href={`/venues/${row.original.id}`}
            className="font-medium underline-offset-4 hover:underline"
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => row.original.slug ?? "—",
      },
      {
        accessorKey: "courtCount",
        header: "Courts",
      },
      {
        accessorKey: "isArchived",
        header: "Archived",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.isArchived ? (
            <Badge variant="secondary">Archived</Badge>
          ) : (
            <span className="text-muted-foreground">Active</span>
          ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const venue = row.original;
          return (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                render={<Link href={`/venues/${venue.id}`} />}
              >
                Open
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingVenue(venue);
                  setDialogOpen(true);
                }}
              >
                <PencilIcon className="size-3.5" />
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={venue.isArchived}
                onClick={() => setArchiveTarget(venue)}
              >
                <ArchiveIcon className="size-3.5" />
                Archive
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Venues</h1>
          <p className="text-sm text-muted-foreground">
            Places and courts used by sessions. Archive instead of deleting.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Add venue
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, slug, or address"
          className="max-w-sm"
          aria-label="Search venues"
        />
        <div className="flex items-center gap-2">
          <Switch
            id="show-archived-venues"
            checked={showArchived}
            onCheckedChange={setShowArchived}
          />
          <Label htmlFor="show-archived-venues">Show archived</Label>
        </div>
      </div>

      {visibleVenues.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No venues</EmptyTitle>
            <EmptyDescription>
              {venues.length === 0
                ? "Add a venue to start attaching courts and sessions."
                : showArchived
                  ? "No venues match this search."
                  : "No active venues match this search. Turn on Show archived to include archived places."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <DataTable columns={columns} data={visibleVenues} pageSize={10} />
      )}

      <VenuesDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingVenue(null);
            router.refresh();
          }
        }}
        venue={editingVenue}
      />

      <AlertDialog
        open={archiveTarget !== null}
        onOpenChange={(open) => {
          if (!open && !isArchiving) setArchiveTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {archiveTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              The venue stays on past sessions. It is hidden from the default list and pickers. This
              does not hard-delete the record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isArchiving}
              onClick={confirmArchive}
            >
              {isArchiving ? "Archiving…" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export type { VenuesTableProps };
export { VenuesTable };
