import type {
  GameRecordingBoardGame,
  GameRecordingBoardProps,
} from "../game-recording-board/GameRecordingBoard.types";
import type { RecordingCardProps } from "../recording-card/RecordingCard.types";

import type { SessionOrganizeGame, SessionOrganizeRecording } from "./SessionOrganize.types";

function isUnassignedLane(recording: SessionOrganizeRecording): boolean {
  return recording.gameId == null || recording.cameraSide === "UNASSIGNED";
}

function toCard(
  recording: SessionOrganizeRecording,
  gameNumber: number | null | undefined,
): RecordingCardProps {
  return {
    id: recording.id,
    originalFilename: recording.originalFilename,
    displayName: recording.displayName ?? undefined,
    sizeBytes: recording.sizeBytes ?? 0,
    durationSeconds: recording.durationSeconds ?? undefined,
    cameraSide: recording.cameraSide,
    partNumber: recording.partNumber,
    gameLabel: gameNumber == null ? undefined : `Game ${gameNumber}`,
  };
}

export function toGameRecordingBoardProps(
  recordings: SessionOrganizeRecording[],
  games: SessionOrganizeGame[],
): GameRecordingBoardProps {
  const sortedGames = [...games].sort((a, b) => a.sortOrder - b.sortOrder);
  const boardGames: GameRecordingBoardGame[] = sortedGames.map((game, index) => ({
    id: game.id,
    gameNumber: game.gameNumber ?? index + 1,
    sides: { A: [], B: [] },
  }));
  const gamesById = new Map(boardGames.map((game) => [game.id, game]));
  const unassigned: RecordingCardProps[] = [];

  const sortedRecordings = [...recordings].sort((a, b) => a.sortOrder - b.sortOrder);
  for (const recording of sortedRecordings) {
    const assignedGame = recording.gameId ? gamesById.get(recording.gameId) : undefined;
    const card = toCard(recording, assignedGame?.gameNumber);
    if (isUnassignedLane(recording) || !assignedGame) {
      unassigned.push(card);
      continue;
    }
    if (recording.cameraSide === "A" || recording.cameraSide === "B") {
      assignedGame.sides[recording.cameraSide].push(card);
    }
  }

  return { unassigned, games: boardGames };
}
