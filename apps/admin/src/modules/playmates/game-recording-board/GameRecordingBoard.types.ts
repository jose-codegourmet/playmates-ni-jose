import type { RecordingCardProps } from "../recording-card/RecordingCard.types";

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
};
