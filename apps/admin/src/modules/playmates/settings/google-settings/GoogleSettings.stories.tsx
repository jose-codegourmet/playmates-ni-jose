import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GoogleSettings } from "./GoogleSettings";

const meta: Meta<typeof GoogleSettings> = {
  title: "Playmates/Settings/GoogleSettings",
  component: GoogleSettings,
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
type Story = StoryObj<typeof GoogleSettings>;

export const Default: Story = {};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
