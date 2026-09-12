import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VenueDetailSessionHistorySection } from "./VenueDetailSessionHistorySection";
import type { VenueDetailSessionHistorySectionProps } from "./VenueDetailSessionHistorySection.types";

const defaultArgs: VenueDetailSessionHistorySectionProps = {
  sessions: [
    {
      href: "/sessions/2026-09-09",
      sessionDate: "2026-09-09",
      title: "Wednesday night",
      venueName: "Smash Court QC",
      gameCount: 10,
      playerNames: ["José", "Carlo", "Mika", "Marco", "Ana", "Luis", "Bea", "Nico"],
    },
  ],
};

const meta: Meta<typeof VenueDetailSessionHistorySection> = {
  title: "Sections/VenueDetail/VenueDetailSessionHistorySection",
  component: VenueDetailSessionHistorySection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof VenueDetailSessionHistorySection>;

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
