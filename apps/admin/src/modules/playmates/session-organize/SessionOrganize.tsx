"use client";

import { Button } from "@fe-template/ui";
import { toast } from "sonner";

import { assignRecording } from "@/app/(dashboard)/sessions/actions";
import type { RecordingAssignTarget } from "../game-recording-board/droppable-ids";
import { GameRecordingBoard } from "../game-recording-board/GameRecordingBoard";

import { toGameRecordingBoardProps } from "./map-board";
import type { SessionOrganizeProps } from "./SessionOrganize.types";

function SessionOrganize({
  sessionId,
  recordings,
  games,
  onAssignRecording,
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
      />
    </div>
  );
}

export type { SessionOrganizeProps };
export { SessionOrganize };
