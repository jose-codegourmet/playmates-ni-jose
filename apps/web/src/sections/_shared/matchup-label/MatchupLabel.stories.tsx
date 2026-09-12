import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";

import { MatchupLabel } from "./MatchupLabel";
import type { MatchupLabelProps } from "./MatchupLabel.types";

const doublesArgs: MatchupLabelProps = {
  team1: ["José", "Carlo"],
  team2: ["Mika", "Marco"],
};

function StoryFrame({ children }: { children: ReactNode }) {
  return <div className="bg-background p-4 text-foreground">{children}</div>;
}

const meta: Meta<typeof MatchupLabel> = {
  title: "Shared/MatchupLabel",
  component: MatchupLabel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: doublesArgs,
};

export default meta;
type Story = StoryObj<typeof MatchupLabel>;

export const Doubles: Story = {
  render: (args) => (
    <StoryFrame>
      <MatchupLabel {...args} />
    </StoryFrame>
  ),
};

export const Singles: Story = {
  args: {
    team1: ["José"],
    team2: ["Mika"],
  },
  render: (args) => (
    <StoryFrame>
      <MatchupLabel {...args} />
    </StoryFrame>
  ),
};

export const OneEmptyTeam: Story = {
  args: {
    team1: ["José", "Carlo"],
    team2: [],
  },
  render: (args) => (
    <StoryFrame>
      <MatchupLabel {...args} />
    </StoryFrame>
  ),
};

export const BothEmpty: Story = {
  args: {
    team1: [],
    team2: [],
  },
  render: (args) => (
    <StoryFrame>
      <MatchupLabel {...args} />
    </StoryFrame>
  ),
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: (args) => (
    <StoryFrame>
      <MatchupLabel {...args} />
    </StoryFrame>
  ),
};
