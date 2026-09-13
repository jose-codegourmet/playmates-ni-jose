import type {
  RecordingCardProps,
  RecordingMoveTarget,
} from "../recording-card/RecordingCard.types";

export type CameraSideLaneSide = "A" | "B";

export type CameraSideLaneProps = {
  side: CameraSideLaneSide;
  recordings: RecordingCardProps[];
  droppableId: string;
  moveTargets?: RecordingMoveTarget[];
  onMoveRecording?: (recordingId: string, droppableId: string) => void;
};
