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
  Button,
} from "@fe-template/ui";
import { useState } from "react";
import { toast } from "sonner";

import {
  assignRecording,
  createSessionGame,
  deleteSessionGame,
  reorderLaneRecordings,
} from "@/app/(dashboard)/sessions/actions";
import {
  parseDroppableId,
  type RecordingAssignTarget,
} from "../game-recording-board/droppable-ids";
import { GameRecordingBoard } from "../game-recording-board/GameRecordingBoard";

import { toGameRecordingBoardProps } from "./map-board";
import type { SessionOrganizeProps } from "./SessionOrganize.types";

function SessionOrganize({
  sessionId,
  recordings,
  games,
  onAssignRecording,
  onReorderLane,
  onCreateGame,
  onRemoveGame,
}: SessionOrganizeProps) {
  const board = toGameRecordingBoardProps(recordings, games);
  const [pending, setPending] = useState(false);
  const [blockedGame, setBlockedGame] = useState<{ id: string; gameNumber: number } | null>(null);

  async function handleAssign(recordingId: string, target: RecordingAssignTarget) {
    if (onAssignRecording) {
      await onAssignRecording(recordingId, target);
      return;
    }

    if (!sessionId) {
      toast.error("Missing session id for assign");
      return;
    }

    const result = await assignRecording(sessionId, recordingId, target);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  async function handleReorder(droppableId: string, recordingIds: string[]) {
    const target = parseDroppableId(droppableId);
    if (!target) {
      return;
    }

    if (onReorderLane) {
      await onReorderLane(target, recordingIds);
      return;
    }

    if (!sessionId) {
      toast.error("Missing session id for reorder");
      return;
    }

    const result = await reorderLaneRecordings(
      sessionId,
      target.gameId,
      target.cameraSide,
      recordingIds,
    );
    if (!result.success) {
      toast.error(result.error);
    }
  }

  async function handleCreateGame() {
    if (pending) {
      return;
    }

    if (onCreateGame) {
      await onCreateGame();
      return;
    }

    if (!sessionId) {
      toast.error("Missing session id for create game");
      return;
    }

    setPending(true);
    const result = await createSessionGame(sessionId);
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  async function handleRemoveGame(gameId: string) {
    const game = games.find((row) => row.id === gameId);
    const hasRecordings = recordings.some((row) => row.gameId === gameId);
    if (hasRecordings) {
      setBlockedGame({
        id: gameId,
        gameNumber: game?.gameNumber ?? 0,
      });
      return;
    }

    if (onRemoveGame) {
      await onRemoveGame(gameId);
      return;
    }

    if (!sessionId) {
      toast.error("Missing session id for remove game");
      return;
    }

    setPending(true);
    const result = await deleteSessionGame(sessionId, gameId);
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" disabled={pending} onClick={() => void handleCreateGame()}>
          Add game
        </Button>
      </div>
      <GameRecordingBoard
        unassigned={board.unassigned}
        games={board.games}
        onAssignRecording={handleAssign}
        onReorderLane={handleReorder}
        onRemoveGame={handleRemoveGame}
      />
      <AlertDialog
        open={blockedGame !== null}
        onOpenChange={(open) => {
          if (!open) {
            setBlockedGame(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {blockedGame
                ? `Move recordings first before removing Game ${blockedGame.gameNumber}`
                : "Move recordings first"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This game still has recordings. Drag or move them to another game or Unassigned, then
              try Remove game again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setBlockedGame(null);
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export type { SessionOrganizeProps };
export { SessionOrganize };
