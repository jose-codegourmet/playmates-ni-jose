import type { CameraSide } from "@fe-template/mocks";

export type GameDetailRecordingItem = {
  id: string;
  label: string;
  partNumber: number;
  filename: string;
  embedUrl?: string;
  driveUrl?: string;
  embedTitle: string;
};

export type GameDetailRecordingGroup = {
  side: CameraSide;
  heading: string;
  recordings: GameDetailRecordingItem[];
};

export type GameDetailRecordingsSectionProps = {
  className?: string;
  groups: GameDetailRecordingGroup[];
};
