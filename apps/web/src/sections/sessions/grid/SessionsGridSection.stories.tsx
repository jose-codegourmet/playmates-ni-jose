import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionsGridSection } from "./SessionsGridSection";
import type { SessionsGridSectionProps } from "./SessionsGridSection.types";

const defaultArgs: SessionsGridSectionProps = {
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

const meta: Meta<typeof SessionsGridSection> = {
  title: "Sections/Sessions/SessionsGridSection",
  component: SessionsGridSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof SessionsGridSection>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    sessions: [],
  },
};

export const SecondVenueOnly: Story = {
  args: {
    sessions: defaultArgs.sessions.filter((session) => session.venueName === "Green Shuttle Pasig"),
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
