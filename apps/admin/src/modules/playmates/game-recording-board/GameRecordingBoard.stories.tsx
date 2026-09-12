import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { mvpBoardFixture } from "./board.fixture";
import { GameRecordingBoard } from "./GameRecordingBoard";

const meta: Meta<typeof GameRecordingBoard> = {
  title: "Playmates/GameRecordingBoard",
  component: GameRecordingBoard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: mvpBoardFixture,
  decorators: [
    (Story) => (
      <div className="min-h-svh bg-background p-4 text-foreground md:p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GameRecordingBoard>;

export const MvpSeed: Story = {};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
