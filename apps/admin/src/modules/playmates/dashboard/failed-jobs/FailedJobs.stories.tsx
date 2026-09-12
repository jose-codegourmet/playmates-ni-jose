import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { emptyDashboard, seedLikeDashboard } from "../dashboard.fixture";
import { FailedJobs } from "./FailedJobs";

const meta: Meta<typeof FailedJobs> = {
  title: "Playmates/Dashboard/FailedJobs",
  component: FailedJobs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    rows: seedLikeDashboard.failedJobs,
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
type Story = StoryObj<typeof FailedJobs>;

export const WithErrorCode: Story = {};

export const Empty: Story = {
  args: { rows: emptyDashboard.failedJobs },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
