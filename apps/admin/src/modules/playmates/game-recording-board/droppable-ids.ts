import type { CameraSide } from "@fe-template/mocks";

export const UNASSIGNED_DROPPABLE_ID = "unassigned";

export type RecordingAssignTarget = {
  gameId: string | null;
  cameraSide: CameraSide;
};

export function gameSideDroppableId(gameId: string, side: "A" | "B"): string {
  return `game:${gameId}:${side}`;
}

export function parseDroppableId(id: string): RecordingAssignTarget | null {
  if (id === UNASSIGNED_DROPPABLE_ID) {
    return { gameId: null, cameraSide: "UNASSIGNED" };
  }

  const match = /^game:(.+):([AB])$/.exec(id);
  if (!match) {
    return null;
  }

  return { gameId: match[1], cameraSide: match[2] as "A" | "B" };
}

export function recordingLaneId(gameId: string | null | undefined, cameraSide: CameraSide): string {
  if (!gameId || cameraSide === "UNASSIGNED") {
    return UNASSIGNED_DROPPABLE_ID;
  }
  if (cameraSide === "A" || cameraSide === "B") {
    return gameSideDroppableId(gameId, cameraSide);
  }
  return UNASSIGNED_DROPPABLE_ID;
}
