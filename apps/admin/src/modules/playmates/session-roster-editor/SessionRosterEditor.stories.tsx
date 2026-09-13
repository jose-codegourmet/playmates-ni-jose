import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionRosterEditor } from "./SessionRosterEditor";

const players = [
  { id: "player-jose", displayName: "José" },
  { id: "player-carlo", displayName: "Carlo" },
  { id: "player-mika", displayName: "Mika" },
  { id: "player-marco", displayName: "Marco" },
];

const meta: Meta<typeof SessionRosterEditor> = {
  title: "Playmates/Sessions/SessionRosterEditor",
  component: SessionRosterEditor,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    sessionId: "dddddddd-0004-4000-8000-000000000001",
    players,
    selectedPlayerIds: ["player-jose", "player-carlo"],
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
type Story = StoryObj<typeof SessionRosterEditor>;

export const Default: Story = {};

export const EmptyRoster: Story = {
  args: {
    selectedPlayerIds: [],
  },
};

export const NoPlayers: Story = {
  args: {
    players: [],
    selectedPlayerIds: [],
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
