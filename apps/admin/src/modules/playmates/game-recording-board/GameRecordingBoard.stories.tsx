import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import type { RecordingCardProps } from "../recording-card/RecordingCard.types";

import { mvpBoardFixture } from "./board.fixture";
import type { RecordingAssignTarget } from "./droppable-ids";
import { GameRecordingBoard } from "./GameRecordingBoard";
import type { GameRecordingBoardGame, GameRecordingBoardProps } from "./GameRecordingBoard.types";

type PlacedCard = {
  card: RecordingCardProps;
  gameId: string | null;
};

function flattenBoard(board: GameRecordingBoardProps): PlacedCard[] {
  return [
    ...board.unassigned.map((card) => ({ card, gameId: null })),
    ...board.games.flatMap((game) => [
      ...game.sides.A.map((card) => ({ card, gameId: game.id })),
      ...game.sides.B.map((card) => ({ card, gameId: game.id })),
    ]),
  ];
}

function rebuildBoard(
  games: GameRecordingBoardGame[],
  placed: PlacedCard[],
): GameRecordingBoardProps {
  const nextGames: GameRecordingBoardGame[] = games.map((game) => ({
    ...game,
    sides: { A: [], B: [] },
  }));
  const unassigned: RecordingCardProps[] = [];

  for (const { card, gameId } of placed) {
    const dest = gameId ? nextGames.find((game) => game.id === gameId) : undefined;
    if (!dest || card.cameraSide === "UNASSIGNED") {
      unassigned.push(card);
      continue;
    }
    if (card.cameraSide === "A" || card.cameraSide === "B") {
      dest.sides[card.cameraSide].push(card);
    }
  }

  return { unassigned, games: nextGames };
}

const meta: Meta<typeof GameRecordingBoard> = {
  title: "Playmates/GameRecordingBoard",
  component: GameRecordingBoard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: mvpBoardFixture,
  decorators: [
    (Story) => (
      <div className="min-h-svh bg-background p-4 text-foreground md:p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GameRecordingBoard>;

export const MvpSeed: Story = {};

export const DragAssign: Story = {
  render: function DragAssignStory(args) {
    const [board, setBoard] = useState<GameRecordingBoardProps>(args);

    function handleAssign(recordingId: string, target: RecordingAssignTarget) {
      setBoard((current) => {
        const destGame = current.games.find((game) => game.id === target.gameId);
        const placed = flattenBoard(current).map(({ card, gameId }) => {
          if (card.id !== recordingId) {
            return { card, gameId };
          }
          return {
            gameId: target.gameId,
            card: {
              ...card,
              cameraSide: target.cameraSide,
              gameLabel: destGame ? `Game ${destGame.gameNumber}` : undefined,
            },
          };
        });
        return rebuildBoard(current.games, placed);
      });
    }

    return (
      <GameRecordingBoard
        unassigned={board.unassigned}
        games={board.games}
        onAssignRecording={handleAssign}
      />
    );
  },
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
