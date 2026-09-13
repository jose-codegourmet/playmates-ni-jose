"use client";

import { Button } from "@fe-template/ui";
import { toast } from "sonner";

import { assignRecording, reorderLaneRecordings } from "@/app/(dashboard)/sessions/actions";
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
}: SessionOrganizeProps) {
  const board = toGameRecordingBoardProps(recordings, games);

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" disabled title="Create empty games in PNJ-067">
          Add game
        </Button>
      </div>
      <GameRecordingBoard
        unassigned={board.unassigned}
        games={board.games}
        onAssignRecording={handleAssign}
        onReorderLane={handleReorder}
      />
    </div>
  );
}

export type { SessionOrganizeProps };
export { SessionOrganize };
