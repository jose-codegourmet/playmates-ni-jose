import type { CameraSide } from "@fe-template/mocks";

export type RecordingCardProps = {
  id: string;
  originalFilename: string;
  displayName?: string;
  sizeBytes: number;
  durationSeconds?: number;
  cameraSide: CameraSide;
  partNumber: number;
  gameLabel?: string;
};
