import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { emptyDashboard, freshSeedDashboard, seedLikeDashboard } from "../dashboard.fixture";
import { DashboardWidgets } from "./DashboardWidgets";

const meta: Meta<typeof DashboardWidgets> = {
  title: "Playmates/Dashboard/DashboardWidgets",
  component: DashboardWidgets,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: seedLikeDashboard,
  decorators: [
    (Story) => (
      <div className="w-[56rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashboardWidgets>;

export const Mixed: Story = {};

export const FreshSeed: Story = {
  args: freshSeedDashboard,
};

export const Empty: Story = {
  args: emptyDashboard,
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
