import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { QuickCreate } from "./QuickCreate";

const meta: Meta<typeof QuickCreate> = {
  title: "Playmates/Dashboard/QuickCreate",
  component: QuickCreate,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
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
type Story = StoryObj<typeof QuickCreate>;

export const Default: Story = {};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
