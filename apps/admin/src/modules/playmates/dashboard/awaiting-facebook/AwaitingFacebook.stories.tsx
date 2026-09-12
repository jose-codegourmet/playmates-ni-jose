import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { emptyDashboard, seedLikeDashboard } from "../dashboard.fixture";
import { AwaitingFacebook } from "./AwaitingFacebook";

const meta: Meta<typeof AwaitingFacebook> = {
  title: "Playmates/Dashboard/AwaitingFacebook",
  component: AwaitingFacebook,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    rows: seedLikeDashboard.awaitingFacebook,
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
type Story = StoryObj<typeof AwaitingFacebook>;

export const Sep9Unposted: Story = {};

export const Empty: Story = {
  args: { rows: emptyDashboard.awaitingFacebook },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
