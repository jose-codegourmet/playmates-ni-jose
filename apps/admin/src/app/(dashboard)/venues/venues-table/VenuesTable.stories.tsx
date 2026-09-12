import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VenuesTable } from "./VenuesTable";
import type { VenueRow } from "./VenuesTable.types";

const now = "2026-09-09T10:00:00.000Z";

const seedLikeVenues: VenueRow[] = [
  {
    id: "bbbbbbbb-0002-4000-8000-000000000001",
    name: "Smash Court QC",
    slug: "smash-court-qc",
    address: "Quezon City",
    notes: null,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
    courtCount: 2,
  },
  {
    id: "bbbbbbbb-0002-4000-8000-000000000002",
    name: "Green Shuttle Pasig",
    slug: "green-shuttle-pasig",
    address: "Pasig",
    notes: null,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
    courtCount: 1,
  },
  {
    id: "venue-archived",
    name: "Archived Gym",
    slug: "archived-gym",
    address: null,
    notes: "Hidden unless Show archived is on.",
    isArchived: true,
    createdAt: now,
    updatedAt: now,
    courtCount: 0,
  },
];

const meta: Meta<typeof VenuesTable> = {
  title: "Playmates/Venues/VenuesTable",
  component: VenuesTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    venues: seedLikeVenues,
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
type Story = StoryObj<typeof VenuesTable>;

export const Seeded: Story = {};

export const Empty: Story = {
  args: { venues: [] },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
