import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayerDetailGamesSection } from "./PlayerDetailGamesSection";
import type { PlayerDetailGamesSectionProps } from "./PlayerDetailGamesSection.types";

const defaultArgs: PlayerDetailGamesSectionProps = {
  games: [
    {
      href: "/games/2026-09-09-game-1",
      gameNumber: 1,
      matchupLabel: "José & Carlo vs Mika & Marco",
      recordingCount: 2,
    },
    {
      href: "/games/2026-09-09-game-4",
      gameNumber: 4,
      matchupLabel: "Bea & Nico vs José & Carlo",
      recordingCount: 3,
    },
    {
      href: "/games/2026-09-09-game-5",
      gameNumber: 5,
      matchupLabel: "José & Carlo vs Mika & Marco",
      recordingCount: 2,
    },
  ],
};

const meta: Meta<typeof PlayerDetailGamesSection> = {
  title: "Sections/PlayerDetail/PlayerDetailGamesSection",
  component: PlayerDetailGamesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof PlayerDetailGamesSection>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    games: [],
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
