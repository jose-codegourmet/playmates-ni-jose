import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { SessionOrganize } from "./SessionOrganize";
import {
  buildSep9OrganizeFixture,
  emptyOrganizeFixture,
  unassignedSideOrganizeFixture,
} from "./session-organize.fixture";

const sep9 = buildSep9OrganizeFixture();

const meta: Meta<typeof SessionOrganize> = {
  title: "Playmates/Sessions/SessionOrganize",
  component: SessionOrganize,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: sep9,
  decorators: [
    (Story) => (
      <div className="min-h-svh bg-background p-4 text-foreground md:p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionOrganize>;

export const Sep9Organized: Story = {};

export const EmptySession: Story = {
  args: emptyOrganizeFixture,
};

export const UnassignedSideBucket: Story = {
  args: unassignedSideOrganizeFixture,
};

export const DragAssign: Story = {
  render: function DragAssignStory(args) {
    const [recordings, setRecordings] = useState(args.recordings);

    return (
      <SessionOrganize
        {...args}
        recordings={recordings}
        onAssignRecording={(recordingId, target) => {
          setRecordings((current) =>
            current.map((recording) =>
              recording.id === recordingId
                ? {
                    ...recording,
                    gameId: target.gameId,
                    cameraSide: target.cameraSide,
                    sortOrder: current.filter(
                      (row) => row.gameId === target.gameId && row.cameraSide === target.cameraSide,
                    ).length,
                  }
                : recording,
            ),
          );
        }}
        onReorderLane={(target, recordingIds) => {
          setRecordings((current) =>
            current.map((recording) => {
              const index = recordingIds.indexOf(recording.id);
              if (index < 0) {
                return recording;
              }
              return {
                ...recording,
                gameId: target.gameId,
                cameraSide: target.cameraSide,
                sortOrder: index,
                partNumber: index + 1,
              };
            }),
          );
        }}
      />
    );
  },
};

export const ReorderParts: Story = {
  ...DragAssign,
};

export const AddRemoveGames: Story = {
  args: emptyOrganizeFixture,
  render: function AddRemoveGamesStory(args) {
    const [games, setGames] = useState(args.games);
    const [recordings, setRecordings] = useState(args.recordings);

    return (
      <SessionOrganize
        {...args}
        games={games}
        recordings={recordings}
        onCreateGame={() => {
          const nextNumber =
            games.reduce((max, game) => Math.max(max, game.gameNumber ?? 0), 0) + 1;
          setGames((current) => [
            ...current,
            { id: `story-game-${nextNumber}`, gameNumber: nextNumber, sortOrder: nextNumber },
          ]);
        }}
        onRemoveGame={(gameId) => {
          setGames((current) => current.filter((game) => game.id !== gameId));
        }}
        onAssignRecording={(recordingId, target) => {
          setRecordings((current) =>
            current.map((recording) =>
              recording.id === recordingId
                ? { ...recording, gameId: target.gameId, cameraSide: target.cameraSide }
                : recording,
            ),
          );
        }}
      />
    );
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
