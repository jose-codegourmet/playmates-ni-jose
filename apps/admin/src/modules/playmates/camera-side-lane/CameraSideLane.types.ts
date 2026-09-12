import type { RecordingCardProps } from "../recording-card/RecordingCard.types";

export type CameraSideLaneSide = "A" | "B";

export type CameraSideLaneProps = {
  side: CameraSideLaneSide;
  recordings: RecordingCardProps[];
  onDropRecording?: (id: string) => void;
};
