import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionDetailGamesSection } from "./SessionDetailGamesSection";
import type { SessionDetailGamesSectionProps } from "./SessionDetailGamesSection.types";

const defaultArgs: SessionDetailGamesSectionProps = {
  games: Array.from({ length: 10 }, (_, index) => {
    const gameNumber = index + 1;
    return {
      href: `/games/2026-09-09-game-${gameNumber}`,
      gameNumber,
      matchupLabel:
        gameNumber % 2 === 0 ? "Mika & Marco vs Ana & Luis" : "José & Carlo vs Mika & Marco",
      recordingCount: gameNumber === 4 ? 3 : 2,
    };
  }),
};

const meta: Meta<typeof SessionDetailGamesSection> = {
  title: "Sections/SessionDetail/SessionDetailGamesSection",
  component: SessionDetailGamesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof SessionDetailGamesSection>;

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
