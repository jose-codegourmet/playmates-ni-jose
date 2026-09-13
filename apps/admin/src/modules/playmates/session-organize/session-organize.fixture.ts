import type { CameraSide } from "@fe-template/mocks";

import type { SessionOrganizeGame, SessionOrganizeRecording } from "./SessionOrganize.types";

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

export function buildSep9OrganizeFixture(): {
  recordings: SessionOrganizeRecording[];
  games: SessionOrganizeGame[];
} {
  const games: SessionOrganizeGame[] = [];
  const recordings: SessionOrganizeRecording[] = [];
  let filenameSeq = 1001;
  let sortOrder = 0;

  for (let gameNumber = 1; gameNumber <= 10; gameNumber += 1) {
    const gameId = `game-${gameNumber}`;
    games.push({ id: gameId, gameNumber, sortOrder: gameNumber });

    for (const spec of recordingLayout(gameNumber)) {
      recordings.push({
        id: `rec-${filenameSeq}`,
        originalFilename: `IMG_${filenameSeq}.MOV`,
        displayName: recordingDisplayName(gameNumber, spec.side, spec.partNumber, spec.partCount),
        sizeBytes: 80_000_000 + filenameSeq * 1000,
        durationSeconds: spec.partCount > 1 ? 540 : 1080,
        cameraSide: spec.side,
        partNumber: spec.partNumber,
        sortOrder,
        gameId,
      });
      filenameSeq += 1;
      sortOrder += 1;
    }
  }

  return { recordings, games };
}

export const emptyOrganizeFixture = {
  recordings: [] satisfies SessionOrganizeRecording[],
  games: [] satisfies SessionOrganizeGame[],
};

export const unassignedSideOrganizeFixture: {
  recordings: SessionOrganizeRecording[];
  games: SessionOrganizeGame[];
} = {
  games: [{ id: "game-1", gameNumber: 1, sortOrder: 1 }],
  recordings: [
    {
      id: "rec-loose",
      originalFilename: "IMG_9001.MOV",
      displayName: null,
      sizeBytes: 12_000_000,
      durationSeconds: 90,
      cameraSide: "UNASSIGNED" satisfies CameraSide,
      partNumber: 1,
      sortOrder: 0,
      gameId: "game-1",
    },
  ],
};
