import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayerForm } from "./PlayerForm";

const meta: Meta<typeof PlayerForm> = {
  title: "Playmates/Players/PlayerForm",
  component: PlayerForm,
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
type Story = StoryObj<typeof PlayerForm>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    player: {
      id: "player-carlo",
      displayName: "Carlo",
      nickname: "Cal",
      facebookName: "Carlo D.",
      facebookUrl: "https://facebook.com/carlo",
      notes: "Usually plays doubles.",
    },
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
