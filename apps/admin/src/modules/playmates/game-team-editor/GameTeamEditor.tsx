"use client";

import { formatMatchup } from "@fe-template/mocks";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  cn,
  NativeSelect,
  NativeSelectOption,
} from "@fe-template/ui";
import { XIcon } from "lucide-react";

import type {
  GameTeamEditorProps,
  GameTeamEditorValue,
  GameTeamRosterPlayer,
} from "./GameTeamEditor.types";

function rosterNameById(roster: GameTeamRosterPlayer[]): Map<string, string> {
  return new Map(roster.map((player) => [player.id, player.displayName]));
}

function namesForTeam(ids: string[], nameById: Map<string, string>): string[] {
  return ids.map((id) => nameById.get(id) ?? id);
}

/** Local matchup preview — same string rules as PNJ-025 via `formatMatchup`. */
export function formatGameTeamMatchup(
  roster: GameTeamRosterPlayer[],
  team1: string[],
  team2: string[],
): string {
  const nameById = rosterNameById(roster);
  return formatMatchup(namesForTeam(team1, nameById), namesForTeam(team2, nameById));
}

function assignedIds(team1: string[], team2: string[]): Set<string> {
  return new Set([...team1, ...team2]);
}

function availableRoster(
  roster: GameTeamRosterPlayer[],
  team1: string[],
  team2: string[],
): GameTeamRosterPlayer[] {
  const taken = assignedIds(team1, team2);
  return roster.filter((player) => !taken.has(player.id));
}

function TeamZone({
  label,
  teamKey,
  playerIds,
  roster,
  available,
  onAdd,
  onRemove,
  onClear,
}: {
  label: "Team 1" | "Team 2";
  teamKey: "team1" | "team2";
  playerIds: string[];
  roster: GameTeamRosterPlayer[];
  available: GameTeamRosterPlayer[];
  onAdd: (playerId: string) => void;
  onRemove: (playerId: string) => void;
  onClear: () => void;
}) {
  const nameById = rosterNameById(roster);
  const isEmpty = playerIds.length === 0;
  const rosterExhausted = available.length === 0;

  return (
    <Card
      size="sm"
      data-slot="game-team-zone"
      data-team={teamKey}
      aria-label={label}
      className="flex min-h-48 flex-col gap-0 bg-background text-foreground"
    >
      <CardHeader className="flex-row items-center justify-between gap-2 border-b border-border px-(--card-spacing) py-2">
        <p className="font-heading text-sm font-medium">{label}</p>
        <Button type="button" variant="ghost" size="xs" disabled={isEmpty} onClick={onClear}>
          Clear team
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-(--card-spacing) py-3">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground">No players yet</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {playerIds.map((playerId) => {
              const displayName = nameById.get(playerId) ?? playerId;
              return (
                <li key={playerId}>
                  <div className="inline-flex h-7 items-center gap-0.5 rounded-4xl bg-secondary pr-0.5 pl-2 text-secondary-foreground">
                    <span className="text-xs font-medium">{displayName}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="size-5 text-muted-foreground"
                      aria-label={`Remove ${displayName} from ${label}`}
                      onClick={() => onRemove(playerId)}
                    >
                      <XIcon />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <NativeSelect
          className="w-full"
          value=""
          disabled={rosterExhausted}
          aria-label={`Add player to ${label}`}
          onChange={(event) => {
            const playerId = event.currentTarget.value;
            if (playerId) {
              onAdd(playerId);
            }
          }}
        >
          <NativeSelectOption value="">
            {rosterExhausted ? "Roster exhausted" : "Add player"}
          </NativeSelectOption>
          {available.map((player) => (
            <NativeSelectOption key={player.id} value={player.id}>
              {player.displayName}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </CardContent>
    </Card>
  );
}

function GameTeamEditor({
  roster,
  team1,
  team2,
  onChange,
  onCopyPrevious,
  className,
}: GameTeamEditorProps) {
  const available = availableRoster(roster, team1, team2);
  const matchupLabel = formatGameTeamMatchup(roster, team1, team2);

  function emit(next: GameTeamEditorValue) {
    onChange(next);
  }

  function addToTeam(teamKey: "team1" | "team2", playerId: string) {
    if (assignedIds(team1, team2).has(playerId)) {
      return;
    }

    if (teamKey === "team1") {
      emit({ team1: [...team1, playerId], team2 });
      return;
    }

    emit({ team1, team2: [...team2, playerId] });
  }

  function removeFromTeam(teamKey: "team1" | "team2", playerId: string) {
    if (teamKey === "team1") {
      emit({ team1: team1.filter((id) => id !== playerId), team2 });
      return;
    }

    emit({ team1, team2: team2.filter((id) => id !== playerId) });
  }

  return (
    <div
      data-slot="game-team-editor"
      className={cn("flex w-full flex-col gap-4 bg-background text-foreground", className)}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-heading text-sm font-medium" aria-live="polite">
          {matchupLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => emit({ team1: team2, team2: team1 })}
          >
            Swap teams
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={team1.length === 0 && team2.length === 0}
            onClick={() => emit({ team1: [], team2: [] })}
          >
            Clear
          </Button>
          {onCopyPrevious ? (
            <Button type="button" variant="outline" size="sm" onClick={() => onCopyPrevious()}>
              Copy previous matchup
            </Button>
          ) : null}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <TeamZone
          label="Team 1"
          teamKey="team1"
          playerIds={team1}
          roster={roster}
          available={available}
          onAdd={(playerId) => addToTeam("team1", playerId)}
          onRemove={(playerId) => removeFromTeam("team1", playerId)}
          onClear={() => emit({ team1: [], team2 })}
        />
        <TeamZone
          label="Team 2"
          teamKey="team2"
          playerIds={team2}
          roster={roster}
          available={available}
          onAdd={(playerId) => addToTeam("team2", playerId)}
          onRemove={(playerId) => removeFromTeam("team2", playerId)}
          onClear={() => emit({ team1, team2: [] })}
        />
      </div>
    </div>
  );
}

export type { GameTeamEditorProps, GameTeamEditorValue, GameTeamRosterPlayer };
export { GameTeamEditor };
