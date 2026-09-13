"use client";

import { Button } from "@fe-template/ui";

import { GameRecordingBoard } from "../game-recording-board/GameRecordingBoard";

import { toGameRecordingBoardProps } from "./map-board";
import type { SessionOrganizeProps } from "./SessionOrganize.types";

function SessionOrganize({ recordings, games }: SessionOrganizeProps) {
  const board = toGameRecordingBoardProps(recordings, games);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" disabled title="Create empty games in PNJ-067">
          Add game
        </Button>
      </div>
      <GameRecordingBoard unassigned={board.unassigned} games={board.games} />
    </div>
  );
}

export type { SessionOrganizeProps };
export { SessionOrganize };
