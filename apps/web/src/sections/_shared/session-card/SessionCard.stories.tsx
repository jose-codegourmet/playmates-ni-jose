import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionCard } from "./SessionCard";
import type { SessionCardProps } from "./SessionCard.types";

const defaultArgs: SessionCardProps = {
  href: "/sessions/2026-09-09",
  sessionDate: "2026-09-09",
  title: "Wednesday night",
  venueName: "Smash Court QC",
  gameCount: 10,
  playerNames: ["José", "Carlo", "Mika", "Marco", "Ana"],
};

const twelvePlayers = [
  "José",
  "Carlo",
  "Mika",
  "Marco",
  "Ana",
  "Luis",
  "Bea",
  "Nico",
  "Iris",
  "Paolo",
  "Rina",
  "Gabe",
];

const meta: Meta<typeof SessionCard> = {
  title: "Shared/SessionCard",
  component: SessionCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof SessionCard>;

export const Default: Story = {};

export const NoVenue: Story = {
  args: {
    venueName: "",
  },
};

export const TwelvePlayers: Story = {
  args: {
    playerNames: twelvePlayers,
  },
};

export const NoGames: Story = {
  args: {
    gameCount: 0,
    playerNames: ["José", "Carlo"],
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
