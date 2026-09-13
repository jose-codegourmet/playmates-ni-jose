"use client";

import { Button, Checkbox } from "@fe-template/ui";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PlayersDialog } from "@/app/(dashboard)/players/players-dialog/PlayersDialog";
import { setSessionRoster } from "@/app/(dashboard)/sessions/actions";

import type { SessionRosterEditorProps, SessionRosterPlayer } from "./SessionRosterEditor.types";

function SessionRosterEditor({
  sessionId,
  players: initialPlayers,
  selectedPlayerIds,
  preservedPlayerIds = [],
}: SessionRosterEditorProps) {
  const router = useRouter();
  const [players, setPlayers] = useState<SessionRosterPlayer[]>(initialPlayers);
  const [selected, setSelected] = useState<string[]>(selectedPlayerIds);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  async function persist(nextSelected: string[]) {
    setSaving(true);
    const result = await setSessionRoster(sessionId, [...preservedPlayerIds, ...nextSelected]);
    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return false;
    }

    toast.success("Roster saved");
    router.refresh();
    return true;
  }

  function togglePlayer(playerId: string, checked: boolean) {
    setSelected((current) => {
      if (checked) {
        if (current.includes(playerId)) return current;
        return [...current, playerId];
      }
      return current.filter((id) => id !== playerId);
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Game pickers use this roster.</p>
      {players.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No active players yet. Add one to start the roster.
        </p>
      ) : (
        <fieldset className="space-y-2 rounded-lg border border-input p-3">
          <legend className="sr-only">Session roster</legend>
          {players.map((player) => {
            const inputId = `session-roster-${player.id}`;
            const checked = selectedSet.has(player.id);
            return (
              <div key={player.id} className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox
                  id={inputId}
                  checked={checked}
                  onCheckedChange={(next) => togglePlayer(player.id, next === true)}
                />
                <label htmlFor={inputId}>{player.displayName}</label>
              </div>
            );
          })}
        </fieldset>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" onClick={() => setCreateOpen(true)}>
          <PlusIcon className="size-4" />
          Add new player
        </Button>
        <Button
          type="button"
          disabled={saving}
          onClick={() => {
            void persist(selected);
          }}
        >
          {saving ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save roster"
          )}
        </Button>
      </div>
      <PlayersDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(player) => {
          setPlayers((current) =>
            current.some((row) => row.id === player.id)
              ? current
              : [...current, { id: player.id, displayName: player.displayName }],
          );
          const nextSelected = selected.includes(player.id) ? selected : [...selected, player.id];
          setSelected(nextSelected);
          void persist(nextSelected);
        }}
      />
    </div>
  );
}

export type { SessionRosterEditorProps };
export { SessionRosterEditor };
