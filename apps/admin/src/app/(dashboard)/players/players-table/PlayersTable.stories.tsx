import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayersTable } from "./PlayersTable";
import type { PlayerRow } from "./PlayersTable.types";

const now = "2026-09-09T10:00:00.000Z";

const seedLikePlayers: PlayerRow[] = [
  {
    id: "player-carlo",
    displayName: "Carlo",
    slug: "carlo",
    nickname: "Cal",
    facebookName: null,
    facebookUrl: null,
    notes: null,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
    gamesCount: 12,
  },
  {
    id: "player-jose",
    displayName: "José",
    slug: "jose",
    nickname: null,
    facebookName: null,
    facebookUrl: null,
    notes: null,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
    gamesCount: 10,
  },
  {
    id: "player-archived",
    displayName: "Archived Mate",
    slug: "archived-mate",
    nickname: "AM",
    facebookName: null,
    facebookUrl: null,
    notes: "Hidden unless Show archived is on.",
    isArchived: true,
    createdAt: now,
    updatedAt: now,
    gamesCount: 2,
  },
];

const meta: Meta<typeof PlayersTable> = {
  title: "Playmates/Players/PlayersTable",
  component: PlayersTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    players: seedLikePlayers,
  },
  decorators: [
    (Story) => (
      <div className="w-[64rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PlayersTable>;

export const Seeded: Story = {};

export const Empty: Story = {
  args: { players: [] },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
