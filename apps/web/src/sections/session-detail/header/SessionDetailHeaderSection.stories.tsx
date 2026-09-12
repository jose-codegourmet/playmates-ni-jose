import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionDetailHeaderSection } from "./SessionDetailHeaderSection";
import type { SessionDetailHeaderSectionProps } from "./SessionDetailHeaderSection.types";

const defaultArgs: SessionDetailHeaderSectionProps = {
  sessionDate: "2026-09-09",
  title: "Wednesday night",
  venueName: "Smash Court QC",
};

const meta: Meta<typeof SessionDetailHeaderSection> = {
  title: "Sections/SessionDetail/SessionDetailHeaderSection",
  component: SessionDetailHeaderSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof SessionDetailHeaderSection>;

export const Default: Story = {};

export const WithNotes: Story = {
  args: {
    notes: "Long rallies on Court 1. Game 4 is split across two Side B parts.",
  },
};

export const DateOnly: Story = {
  args: {
    title: undefined,
    venueName: undefined,
    notes: undefined,
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
