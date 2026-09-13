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
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { archivePlayer } from "../actions";
import { PlayersDialog } from "../players-dialog/PlayersDialog";
import type { PlayerRow, PlayersTableProps } from "./PlayersTable.types";

function matchesSearch(player: PlayerRow, query: string) {
  if (!query) return true;
  const haystack = [player.displayName, player.nickname, player.slug]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function PlayersTable({ players }: PlayersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerRow | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<PlayerRow | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const visiblePlayers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return players.filter((player) => {
      if (!showArchived && player.isArchived) return false;
      return matchesSearch(player, query);
    });
  }, [players, search, showArchived]);

  function openCreate() {
    setEditingPlayer(null);
    setDialogOpen(true);
  }

  async function confirmArchive() {
    if (!archiveTarget) return;
    setIsArchiving(true);
    let result: Awaited<ReturnType<typeof archivePlayer>>;
    try {
      result = await archivePlayer(archiveTarget.id);
    } catch {
      setIsArchiving(false);
      toast.error("Could not archive player.");
      return;
    }
    setIsArchiving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    setArchiveTarget(null);
    router.refresh();
  }

  const columns = useMemo<ColumnDef<PlayerRow>[]>(
    () => [
      {
        accessorKey: "displayName",
        header: "Display name",
      },
      {
        accessorKey: "nickname",
        header: "Nickname",
        cell: ({ row }) => row.original.nickname ?? "—",
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => row.original.slug ?? "—",
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
        accessorKey: "gamesCount",
        header: "Games",
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const player = row.original;
          return (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingPlayer(player);
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
                disabled={player.isArchived}
                onClick={() => setArchiveTarget(player)}
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
          <h1 className="font-display text-3xl tracking-tight">Players</h1>
          <p className="text-sm text-muted-foreground">
            Reusable people across sessions. Archive instead of deleting.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Add player
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, nickname, or slug"
          className="max-w-sm"
          aria-label="Search players"
        />
        <div className="flex items-center gap-2">
          <Switch id="show-archived" checked={showArchived} onCheckedChange={setShowArchived} />
          <Label htmlFor="show-archived">Show archived</Label>
        </div>
      </div>

      {visiblePlayers.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No players</EmptyTitle>
            <EmptyDescription>
              {players.length === 0
                ? "Add a player to start building session rosters."
                : showArchived
                  ? "No players match this search."
                  : "No active players match this search. Turn on Show archived to include archived people."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <DataTable columns={columns} data={visiblePlayers} pageSize={10} />
      )}

      <PlayersDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingPlayer(null);
            router.refresh();
          }
        }}
        player={editingPlayer}
      />

      <AlertDialog
        open={archiveTarget !== null}
        onOpenChange={(open) => {
          if (!open && !isArchiving) setArchiveTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {archiveTarget?.displayName}?</AlertDialogTitle>
            <AlertDialogDescription>
              The player stays in history on past games and the session roster. They are hidden from
              the default list and pickers. This does not hard-delete the record.
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

export type { PlayersTableProps };
export { PlayersTable };
