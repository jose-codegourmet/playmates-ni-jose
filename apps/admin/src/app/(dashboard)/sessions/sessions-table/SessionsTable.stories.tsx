import { SEED_IDS } from "@fe-template/mocks";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionsTable } from "./SessionsTable";
import type { SessionRow } from "./SessionsTable.types";

const seedLikeSessions: SessionRow[] = [
  {
    id: SEED_IDS.sessions.sep9,
    date: "2026-09-09",
    title: "Wednesday night",
    venueName: "Smash Court QC",
    status: "published",
    visibility: "public",
    gameCount: 8,
  },
  {
    id: SEED_IDS.sessions.draftSep2,
    date: "2026-09-02",
    title: "Draft night",
    venueName: "Smash Court QC",
    status: "draft",
    visibility: "private",
    gameCount: 1,
  },
  {
    id: SEED_IDS.sessions.aug26,
    date: "2026-08-26",
    title: "Wednesday night",
    venueName: "Green Shuttle Pasig",
    status: "published",
    visibility: "public",
    gameCount: 4,
  },
];

const meta: Meta<typeof SessionsTable> = {
  title: "Playmates/Sessions/SessionsTable",
  component: SessionsTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    sessions: seedLikeSessions,
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
type Story = StoryObj<typeof SessionsTable>;

export const Seeded: Story = {};

export const Empty: Story = {
  args: { sessions: [] },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
