import type { CameraSide } from "@fe-template/mocks";

export type RecordingMoveTarget = {
  value: string;
  label: string;
};

export type RecordingCardProps = {
  id: string;
  originalFilename: string;
  displayName?: string;
  sizeBytes: number;
  durationSeconds?: number;
  cameraSide: CameraSide;
  partNumber: number;
  gameLabel?: string;
  droppableId?: string;
  moveTargets?: RecordingMoveTarget[];
  onMoveTo?: (droppableId: string) => void;
};
