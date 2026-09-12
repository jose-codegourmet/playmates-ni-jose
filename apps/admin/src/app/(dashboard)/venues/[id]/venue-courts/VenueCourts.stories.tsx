import type { Court, Venue } from "@fe-template/mocks";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VenueCourts } from "./VenueCourts";

const now = "2026-09-09T10:00:00.000Z";

const venue: Venue = {
  id: "bbbbbbbb-0002-4000-8000-000000000001",
  name: "Smash Court QC",
  slug: "smash-court-qc",
  address: "Quezon City",
  notes: "Two courts on the seed.",
  isArchived: false,
  createdAt: now,
  updatedAt: now,
};

const courts: Court[] = [
  {
    id: "cccccccc-0003-4000-8000-000000000001",
    venueId: venue.id,
    name: "Court 1",
    sortOrder: 1,
    isArchived: false,
  },
  {
    id: "cccccccc-0003-4000-8000-000000000002",
    venueId: venue.id,
    name: "Court 2",
    sortOrder: 2,
    isArchived: false,
  },
  {
    id: "court-archived",
    venueId: venue.id,
    name: "Old Court",
    sortOrder: 3,
    isArchived: true,
  },
];

const meta: Meta<typeof VenueCourts> = {
  title: "Playmates/Venues/VenueCourts",
  component: VenueCourts,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    venue,
    courts,
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
type Story = StoryObj<typeof VenueCourts>;

export const Seeded: Story = {};

export const Empty: Story = {
  args: { courts: [] },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
