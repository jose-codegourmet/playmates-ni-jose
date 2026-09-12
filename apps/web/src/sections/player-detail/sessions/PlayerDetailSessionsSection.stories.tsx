import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayerDetailSessionsSection } from "./PlayerDetailSessionsSection";
import type { PlayerDetailSessionsSectionProps } from "./PlayerDetailSessionsSection.types";

const defaultArgs: PlayerDetailSessionsSectionProps = {
  sessions: [
    {
      href: "/sessions/2026-09-09",
      sessionDate: "2026-09-09",
      title: "Wednesday night",
      venueName: "Smash Court QC",
      gameCount: 10,
      playerNames: ["José", "Carlo", "Mika", "Marco", "Ana", "Luis", "Bea", "Nico"],
    },
    {
      href: "/sessions/2026-08-26",
      sessionDate: "2026-08-26",
      title: "Wednesday night",
      venueName: "Green Shuttle Pasig",
      gameCount: 2,
      playerNames: ["José", "Carlo", "Mika", "Marco"],
    },
  ],
};

const meta: Meta<typeof PlayerDetailSessionsSection> = {
  title: "Sections/PlayerDetail/PlayerDetailSessionsSection",
  component: PlayerDetailSessionsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof PlayerDetailSessionsSection>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    sessions: [],
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
