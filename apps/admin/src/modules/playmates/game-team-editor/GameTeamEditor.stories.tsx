import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { GameTeamEditor } from "./GameTeamEditor";
import type { GameTeamEditorProps, GameTeamRosterPlayer } from "./GameTeamEditor.types";

const SESSION_ROSTER: GameTeamRosterPlayer[] = [
  { id: "pl_jose", displayName: "José" },
  { id: "pl_carlo", displayName: "Carlo" },
  { id: "pl_mika", displayName: "Mika" },
  { id: "pl_marco", displayName: "Marco" },
  { id: "pl_ana", displayName: "Ana" },
  { id: "pl_luis", displayName: "Luis" },
  { id: "pl_bea", displayName: "Bea" },
  { id: "pl_nico", displayName: "Nico" },
];

const FOUR_PLAYER_ROSTER = SESSION_ROSTER.slice(0, 4);

function GameTeamEditorPlayground(props: GameTeamEditorProps) {
  const [team1, setTeam1] = useState(props.team1);
  const [team2, setTeam2] = useState(props.team2);

  return (
    <GameTeamEditor
      {...props}
      team1={team1}
      team2={team2}
      onChange={(next) => {
        setTeam1(next.team1);
        setTeam2(next.team2);
        props.onChange(next);
      }}
    />
  );
}

const meta: Meta<typeof GameTeamEditor> = {
  title: "Playmates/GameTeamEditor",
  component: GameTeamEditor,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    roster: SESSION_ROSTER,
    team1: [],
    team2: [],
    onChange: () => {},
    onCopyPrevious: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
  render: (args) => <GameTeamEditorPlayground {...args} />,
};

export default meta;
type Story = StoryObj<typeof GameTeamEditor>;

export const Empty: Story = {};

export const Doubles: Story = {
  args: {
    team1: ["pl_jose", "pl_carlo"],
    team2: ["pl_mika", "pl_marco"],
  },
};

export const Singles: Story = {
  args: {
    team1: ["pl_jose"],
    team2: ["pl_carlo"],
  },
};

export const RosterExhausted: Story = {
  args: {
    roster: FOUR_PLAYER_ROSTER,
    team1: ["pl_jose", "pl_carlo"],
    team2: ["pl_mika", "pl_marco"],
  },
};

export const Dark: Story = {
  args: {
    team1: ["pl_jose", "pl_carlo"],
    team2: ["pl_mika", "pl_marco"],
  },
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
