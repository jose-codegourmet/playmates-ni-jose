import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { SessionWorkspaceSaveProvider } from "../session-workspace-header/SessionWorkspaceSaveContext";
import { SessionMatchups } from "./SessionMatchups";
import type { SessionMatchupsGame, SessionMatchupsProps } from "./SessionMatchups.types";

const roster = [
  { id: "pl_jose", displayName: "José" },
  { id: "pl_carlo", displayName: "Carlo" },
  { id: "pl_mika", displayName: "Mika" },
  { id: "pl_marco", displayName: "Marco" },
  { id: "pl_ana", displayName: "Ana" },
];

const seededGames: SessionMatchupsGame[] = [
  {
    id: "game-1",
    gameNumber: 1,
    sortOrder: 1,
    team1: ["pl_jose", "pl_carlo"],
    team2: ["pl_mika", "pl_marco"],
    winnerTeamNo: null,
  },
  {
    id: "game-2",
    gameNumber: 2,
    sortOrder: 2,
    team1: [],
    team2: [],
    winnerTeamNo: null,
  },
];

function SessionMatchupsPlayground(props: SessionMatchupsProps) {
  const [games, setGames] = useState(props.games);

  return (
    <SessionWorkspaceSaveProvider>
      <SessionMatchups
        {...props}
        games={games}
        onSetTeams={(gameId, next) => {
          setGames((current) =>
            current.map((game) => (game.id === gameId ? { ...game, ...next } : game)),
          );
        }}
        onSetWinner={(gameId, winnerTeamNo) => {
          setGames((current) =>
            current.map((game) => (game.id === gameId ? { ...game, winnerTeamNo } : game)),
          );
        }}
      />
    </SessionWorkspaceSaveProvider>
  );
}

const meta: Meta<typeof SessionMatchups> = {
  title: "Playmates/Sessions/SessionMatchups",
  component: SessionMatchups,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    sessionId: "session-sep-9",
    roster,
    games: seededGames,
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[48rem] max-w-full bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
  render: (args) => <SessionMatchupsPlayground {...args} />,
};

export default meta;
type Story = StoryObj<typeof SessionMatchups>;

export const DoublesReadyToCopy: Story = {};

export const EmptyRoster: Story = {
  args: {
    roster: [],
    games: seededGames,
  },
};

export const NoGames: Story = {
  args: {
    games: [],
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
