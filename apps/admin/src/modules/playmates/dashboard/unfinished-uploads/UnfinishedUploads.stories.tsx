import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { emptyDashboard, seedLikeDashboard } from "../dashboard.fixture";
import { UnfinishedUploads } from "./UnfinishedUploads";

const meta: Meta<typeof UnfinishedUploads> = {
  title: "Playmates/Dashboard/UnfinishedUploads",
  component: UnfinishedUploads,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    rows: seedLikeDashboard.unfinishedUploads,
  },
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UnfinishedUploads>;

export const WithJobs: Story = {};

export const AllFinished: Story = {
  args: { rows: emptyDashboard.unfinishedUploads },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
