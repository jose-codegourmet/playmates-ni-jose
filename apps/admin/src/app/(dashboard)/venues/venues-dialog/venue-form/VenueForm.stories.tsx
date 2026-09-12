import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VenueForm } from "./VenueForm";

const meta: Meta<typeof VenueForm> = {
  title: "Playmates/Venues/VenueForm",
  component: VenueForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-[24rem] max-w-full bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VenueForm>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    venue: {
      id: "bbbbbbbb-0002-4000-8000-000000000001",
      name: "Smash Court QC",
      address: "Quezon City",
      notes: "Two courts.",
    },
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
