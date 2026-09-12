import type { RecordingCardProps } from "../recording-card/RecordingCard.types";
import type { GameRecordingBoardGame, GameRecordingBoardProps } from "./GameRecordingBoard.types";

type SideSpec = { side: "A" | "B"; partNumber: number; partCount: number };

/** Copied from packages/mocks seed layout (PNJ-013). Do not import the store. */
function recordingLayout(gameNumber: number): SideSpec[] {
  if (gameNumber === 4) {
    return [
      { side: "A", partNumber: 1, partCount: 1 },
      { side: "B", partNumber: 1, partCount: 2 },
      { side: "B", partNumber: 2, partCount: 2 },
    ];
  }
  if (gameNumber === 8) {
    return [{ side: "A", partNumber: 1, partCount: 1 }];
  }
  if (gameNumber === 10) {
    return [
      { side: "A", partNumber: 1, partCount: 1 },
      { side: "B", partNumber: 1, partCount: 2 },
      { side: "B", partNumber: 2, partCount: 2 },
    ];
  }
  return [
    { side: "A", partNumber: 1, partCount: 1 },
    { side: "B", partNumber: 1, partCount: 1 },
  ];
}

function recordingDisplayName(
  gameNumber: number,
  side: "A" | "B",
  partNumber: number,
  partCount: number,
): string {
  const base = `Game ${gameNumber} - Side ${side}`;
  return partCount > 1 ? `${base} - Part ${partNumber}` : base;
}

function buildMvpBoardFixture(): GameRecordingBoardProps {
  const games: GameRecordingBoardGame[] = [];
  let filenameSeq = 1001;

  for (let gameNumber = 1; gameNumber <= 10; gameNumber += 1) {
    const sides: GameRecordingBoardGame["sides"] = { A: [], B: [] };

    for (const spec of recordingLayout(gameNumber)) {
      const card: RecordingCardProps = {
        id: `rec-${filenameSeq}`,
        originalFilename: `IMG_${filenameSeq}.MOV`,
        displayName: recordingDisplayName(gameNumber, spec.side, spec.partNumber, spec.partCount),
        sizeBytes: 80_000_000 + filenameSeq * 1000,
        durationSeconds: spec.partCount > 1 ? 540 : 1080,
        cameraSide: spec.side,
        partNumber: spec.partNumber,
        gameLabel: `Game ${gameNumber}`,
      };
      sides[spec.side].push(card);
      filenameSeq += 1;
    }

    games.push({
      id: `game-${gameNumber}`,
      gameNumber,
      sides,
    });
  }

  return {
    unassigned: [],
    games,
  };
}

/** Sep 9 MVP seed shape: 10 games, 21 assigned files, no unassigned. */
export const mvpBoardFixture: GameRecordingBoardProps = buildMvpBoardFixture();
