import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { emptyDashboard, seedLikeDashboard } from "../dashboard.fixture";
import { LatestSessions } from "./LatestSessions";

const meta: Meta<typeof LatestSessions> = {
  title: "Playmates/Dashboard/LatestSessions",
  component: LatestSessions,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    rows: seedLikeDashboard.latestSessions,
  },
  decorators: [
    (Story) => (
      <div className="w-[48rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LatestSessions>;

export const Seeded: Story = {};

export const Empty: Story = {
  args: { rows: emptyDashboard.latestSessions },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
