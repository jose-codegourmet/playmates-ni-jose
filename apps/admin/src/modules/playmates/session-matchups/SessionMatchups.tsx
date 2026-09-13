"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  NativeSelect,
  NativeSelectOption,
} from "@fe-template/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { setGameTeams, setGameWinner } from "@/app/(dashboard)/sessions/actions";

import { GameTeamEditor } from "../game-team-editor/GameTeamEditor";
import { useSessionWorkspaceSave } from "../session-workspace-header/SessionWorkspaceSaveContext";
import type {
  SessionMatchupsGame,
  SessionMatchupsProps,
  SessionMatchupsTeamsValue,
  SessionMatchupsWinner,
} from "./SessionMatchups.types";

function gameHeading(game: SessionMatchupsGame): string {
  return game.gameNumber != null ? `Game ${game.gameNumber}` : "Game";
}

function SessionMatchups({
  sessionId,
  roster,
  games,
  onSetTeams,
  onSetWinner,
}: SessionMatchupsProps) {
  const [localGames, setLocalGames] = useState(games);
  const { beginSave, endSave } = useSessionWorkspaceSave();

  useEffect(() => {
    setLocalGames(games);
  }, [games]);

  async function flickerSave(work: () => Promise<void>): Promise<void> {
    beginSave();
    try {
      await work();
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 280);
      });
      endSave(true);
    } catch {
      endSave(false);
    }
  }

  async function persistResult<T extends { success: boolean; error?: string }>(
    action: () => Promise<T>,
  ): Promise<boolean> {
    beginSave();
    const result = await action();
    if (!result.success) {
      endSave(false);
      toast.error(result.error ?? "Could not save matchup.");
      return false;
    }
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 280);
    });
    endSave(true);
    return true;
  }

  function patchGame(gameId: string, patch: Partial<SessionMatchupsGame>) {
    setLocalGames((current) =>
      current.map((game) => (game.id === gameId ? { ...game, ...patch } : game)),
    );
  }

  async function persistTeams(gameId: string, next: SessionMatchupsTeamsValue) {
    patchGame(gameId, next);

    if (onSetTeams) {
      await flickerSave(async () => {
        await onSetTeams(gameId, next);
      });
      return;
    }

    if (!sessionId) {
      toast.error("Missing session id for matchup");
      return;
    }

    await persistResult(() => setGameTeams(sessionId, gameId, next));
  }

  async function persistWinner(gameId: string, winnerTeamNo: SessionMatchupsWinner) {
    patchGame(gameId, { winnerTeamNo });

    if (onSetWinner) {
      await flickerSave(async () => {
        await onSetWinner(gameId, winnerTeamNo);
      });
      return;
    }

    if (!sessionId) {
      toast.error("Missing session id for winner");
      return;
    }

    await persistResult(() => setGameWinner(sessionId, gameId, winnerTeamNo));
  }

  function copyPrevious(game: SessionMatchupsGame, index: number) {
    const previous = localGames[index - 1];
    if (!previous) {
      return;
    }
    void persistTeams(game.id, { team1: [...previous.team1], team2: [...previous.team2] });
  }

  if (roster.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Add players on the{" "}
        <Button
          variant="link"
          size="sm"
          className="h-auto px-0"
          render={<Link href={`/sessions/${sessionId}/players`} />}
        >
          Players
        </Button>{" "}
        step first. Game pickers use that roster.
      </p>
    );
  }

  if (localGames.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No games yet. Add games on the{" "}
        <Button
          variant="link"
          size="sm"
          className="h-auto px-0"
          render={<Link href={`/sessions/${sessionId}/organize`} />}
        >
          Organize
        </Button>{" "}
        step, then assign teams here.
      </p>
    );
  }

  return (
    <div className="space-y-6" data-slot="session-matchups">
      <p className="text-sm text-muted-foreground">
        Assign session roster players to Team 1 and Team 2 for each game.
      </p>
      {localGames.map((game, index) => (
        <Card key={game.id} size="sm" className="gap-0 bg-background text-foreground">
          <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border px-(--card-spacing) py-3">
            <h3 className="font-heading text-base font-medium">{gameHeading(game)}</h3>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <span className="text-muted-foreground">Winner</span>
              <NativeSelect
                aria-label={`${gameHeading(game)} winner`}
                className="w-40"
                value={game.winnerTeamNo == null ? "" : String(game.winnerTeamNo)}
                onChange={(event) => {
                  const raw = event.currentTarget.value;
                  const winner: SessionMatchupsWinner = raw === "1" ? 1 : raw === "2" ? 2 : null;
                  void persistWinner(game.id, winner);
                }}
              >
                <NativeSelectOption value="">Unset</NativeSelectOption>
                <NativeSelectOption value="1">Team 1</NativeSelectOption>
                <NativeSelectOption value="2">Team 2</NativeSelectOption>
              </NativeSelect>
            </div>
          </CardHeader>
          <CardContent className="px-(--card-spacing) py-4">
            <GameTeamEditor
              roster={roster}
              team1={game.team1}
              team2={game.team2}
              onChange={(next) => {
                void persistTeams(game.id, next);
              }}
              onCopyPrevious={
                index > 0
                  ? () => {
                      copyPrevious(game, index);
                    }
                  : undefined
              }
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export type { SessionMatchupsProps };
export { SessionMatchups };
