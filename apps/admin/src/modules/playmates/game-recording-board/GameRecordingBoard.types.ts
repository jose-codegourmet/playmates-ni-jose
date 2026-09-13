import type { RecordingCardProps } from "../recording-card/RecordingCard.types";

import type { RecordingAssignTarget } from "./droppable-ids";

export type GameRecordingBoardGame = {
  id: string;
  gameNumber: number;
  sides: {
    A: RecordingCardProps[];
    B: RecordingCardProps[];
  };
};

export type GameRecordingBoardProps = {
  unassigned: RecordingCardProps[];
  games: GameRecordingBoardGame[];
  onAssignRecording?: (recordingId: string, target: RecordingAssignTarget) => void;
};
