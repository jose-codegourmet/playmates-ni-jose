import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RecentGamesSection } from "./RecentGamesSection";
import type { RecentGamesSectionProps } from "./RecentGamesSection.types";

const defaultArgs: RecentGamesSectionProps = {
  games: [
    {
      href: "/games/2026-09-09-game-1",
      gameNumber: 1,
      matchupLabel: "José & Carlo vs Mika & Marco",
      recordingCount: 2,
    },
    {
      href: "/games/2026-09-09-game-2",
      gameNumber: 2,
      matchupLabel: "Mika & Marco vs Ana & Luis",
      recordingCount: 2,
    },
    {
      href: "/games/2026-09-09-game-3",
      gameNumber: 3,
      matchupLabel: "Ana & Luis vs Bea & Nico",
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
    {
      href: "/games/2026-09-09-game-6",
      gameNumber: 6,
      matchupLabel: "Mika & Marco vs Ana & Luis",
      recordingCount: 2,
    },
  ],
};

const meta: Meta<typeof RecentGamesSection> = {
  title: "Sections/Home/RecentGamesSection",
  component: RecentGamesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof RecentGamesSection>;

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
