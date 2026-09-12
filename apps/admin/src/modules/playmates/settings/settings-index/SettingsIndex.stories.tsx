import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SettingsIndex } from "./SettingsIndex";

const meta: Meta<typeof SettingsIndex> = {
  title: "Playmates/Settings/SettingsIndex",
  component: SettingsIndex,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SettingsIndex>;

export const Default: Story = {};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
