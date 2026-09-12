import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GameDetailHeaderSection } from "./GameDetailHeaderSection";
import type { GameDetailHeaderSectionProps } from "./GameDetailHeaderSection.types";

const defaultArgs: GameDetailHeaderSectionProps = {
  gameNumber: 4,
  team1: ["Bea", "Nico"],
  team2: ["José", "Carlo"],
  sessionDate: "2026-09-09",
  sessionHref: "/sessions/2026-09-09",
  sessionTitle: "Wednesday night",
  venueName: "Smash Court QC",
};

const meta: Meta<typeof GameDetailHeaderSection> = {
  title: "Sections/GameDetail/GameDetailHeaderSection",
  component: GameDetailHeaderSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof GameDetailHeaderSection>;

export const Default: Story = {};

export const DateOnlySession: Story = {
  args: {
    sessionTitle: undefined,
    venueName: undefined,
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
