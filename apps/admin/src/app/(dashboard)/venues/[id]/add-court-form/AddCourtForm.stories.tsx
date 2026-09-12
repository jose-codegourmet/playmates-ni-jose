import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AddCourtForm } from "./AddCourtForm";

const meta: Meta<typeof AddCourtForm> = {
  title: "Playmates/Venues/AddCourtForm",
  component: AddCourtForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    venueId: "bbbbbbbb-0002-4000-8000-000000000001",
  },
  decorators: [
    (Story) => (
      <div className="w-[32rem] max-w-full bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AddCourtForm>;

export const Default: Story = {};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
