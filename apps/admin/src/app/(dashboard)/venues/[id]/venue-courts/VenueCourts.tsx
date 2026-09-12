"use client";

import type { Court } from "@fe-template/mocks";
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
  Label,
  Switch,
} from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { ArchiveIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { archiveCourt, archiveVenue } from "../../actions";
import { VenuesDialog } from "../../venues-dialog/VenuesDialog";
import { AddCourtForm } from "../add-court-form/AddCourtForm";
import type { VenueCourtsProps } from "./VenueCourts.types";

function VenueCourts({ venue, courts }: VenueCourtsProps) {
  const router = useRouter();
  const [showArchived, setShowArchived] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [archiveVenueOpen, setArchiveVenueOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<Court | null>(null);
  const [isArchivingCourt, setIsArchivingCourt] = useState(false);
  const [isArchivingVenue, setIsArchivingVenue] = useState(false);

  const visibleCourts = useMemo(
    () => courts.filter((court) => showArchived || !court.isArchived),
    [courts, showArchived],
  );

  async function confirmArchiveCourt() {
    if (!archiveTarget) return;
    setIsArchivingCourt(true);
    const result = await archiveCourt(archiveTarget.id);
    setIsArchivingCourt(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    setArchiveTarget(null);
    router.refresh();
  }

  async function confirmArchiveVenue() {
    setIsArchivingVenue(true);
    const result = await archiveVenue(venue.id);
    setIsArchivingVenue(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    setArchiveVenueOpen(false);
    router.refresh();
  }

  const columns = useMemo<ColumnDef<Court>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
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
          const court = row.original;
          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={court.isArchived}
              onClick={() => setArchiveTarget(court)}
            >
              <ArchiveIcon className="size-3.5" />
              Archive
            </Button>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            <Link href="/venues" className="underline-offset-4 hover:underline">
              Venues
            </Link>
          </p>
          <h1 className="font-display text-3xl tracking-tight">{venue.name}</h1>
          <p className="text-sm text-muted-foreground">
            Slug {venue.slug ?? "—"}. {venue.address ?? "No address."}
          </p>
          {venue.isArchived ? <Badge variant="secondary">Archived</Badge> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <PencilIcon className="size-3.5" />
            Edit venue
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={venue.isArchived}
            onClick={() => setArchiveVenueOpen(true)}
          >
            <ArchiveIcon className="size-3.5" />
            Archive venue
          </Button>
        </div>
      </div>

      {venue.notes ? <p className="text-sm text-muted-foreground">{venue.notes}</p> : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">Courts</h2>
          <p className="text-sm text-muted-foreground">
            Add named courts for this venue. Session create (PNJ-058) will keep a court on its own
            venue.
          </p>
        </div>

        <AddCourtForm venueId={venue.id} onSuccess={() => router.refresh()} />

        <div className="flex items-center gap-2">
          <Switch
            id="show-archived-courts"
            checked={showArchived}
            onCheckedChange={setShowArchived}
          />
          <Label htmlFor="show-archived-courts">Show archived</Label>
        </div>

        {visibleCourts.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No courts</EmptyTitle>
              <EmptyDescription>
                {courts.length === 0
                  ? "Add Court 1 to start using this venue on sessions."
                  : "No active courts. Turn on Show archived to include archived courts."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable columns={columns} data={visibleCourts} pageSize={10} />
        )}
      </section>

      <VenuesDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) router.refresh();
        }}
        venue={venue}
      />

      <AlertDialog
        open={archiveTarget !== null}
        onOpenChange={(open) => {
          if (!open && !isArchivingCourt) setArchiveTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {archiveTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              The court stays on past sessions. It is hidden from the default list. This does not
              hard-delete the record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchivingCourt}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isArchivingCourt}
              onClick={confirmArchiveCourt}
            >
              {isArchivingCourt ? "Archiving…" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={archiveVenueOpen}
        onOpenChange={(open) => {
          if (!open && !isArchivingVenue) setArchiveVenueOpen(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {venue.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              The venue stays on past sessions and is hidden from the default list. This does not
              hard-delete the record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchivingVenue}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isArchivingVenue}
              onClick={confirmArchiveVenue}
            >
              {isArchivingVenue ? "Archiving…" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export type { VenueCourtsProps };
export { VenueCourts };
