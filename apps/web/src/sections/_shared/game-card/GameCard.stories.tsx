import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GameCard } from "./GameCard";
import type { GameCardProps } from "./GameCard.types";

const fullArgs: GameCardProps = {
  href: "/games/2026-09-09-game-3",
  gameNumber: 3,
  matchupLabel: "José & Carlo vs Mika & Marco",
  recordingCount: 2,
  youtubeHref: "https://www.youtube.com/watch?v=abcdefghijk",
  driveHref: "https://drive.google.com/file/d/example-drive/view",
};

const meta: Meta<typeof GameCard> = {
  title: "Shared/GameCard",
  component: GameCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: fullArgs,
};

export default meta;
type Story = StoryObj<typeof GameCard>;

export const Full: Story = {};

export const EmptyMatchup: Story = {
  args: {
    matchupLabel: "Team 1 vs Team 2",
  },
};

export const YoutubeOnly: Story = {
  args: {
    driveHref: "",
  },
};

export const NoLinks: Story = {
  args: {
    youtubeHref: "",
    driveHref: "",
  },
};

export const ThreeVideos: Story = {
  args: {
    recordingCount: 3,
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
