import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionDetailsForm } from "./SessionDetailsForm";

const venues = [
  { id: "bbbbbbbb-0002-4000-8000-000000000001", name: "Smash Court QC" },
  { id: "bbbbbbbb-0002-4000-8000-000000000002", name: "Green Shuttle Pasig" },
];

const courts = [
  {
    id: "cccccccc-0003-4000-8000-000000000001",
    name: "Court 1",
    venueId: "bbbbbbbb-0002-4000-8000-000000000001",
  },
  {
    id: "cccccccc-0003-4000-8000-000000000002",
    name: "Court 2",
    venueId: "bbbbbbbb-0002-4000-8000-000000000001",
  },
  {
    id: "cccccccc-0003-4000-8000-000000000003",
    name: "Court 1",
    venueId: "bbbbbbbb-0002-4000-8000-000000000002",
  },
];

const meta: Meta<typeof SessionDetailsForm> = {
  title: "Playmates/Sessions/SessionDetailsForm",
  component: SessionDetailsForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    sessionId: "dddddddd-0004-4000-8000-000000000001",
    slug: "2026-09-09-smash-court-qc",
    venues,
    courts,
    defaultValues: {
      sessionDate: "2026-09-09",
      title: "Tuesday night games",
      venueId: "bbbbbbbb-0002-4000-8000-000000000001",
      courtId: "cccccccc-0003-4000-8000-000000000001",
      notes: "Seed session",
      visibility: "public",
      status: "published",
    },
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
type Story = StoryObj<typeof SessionDetailsForm>;

export const Default: Story = {};

export const Draft: Story = {
  args: {
    slug: "2026-09-13",
    defaultValues: {
      sessionDate: "2026-09-13",
      title: "",
      venueId: "",
      courtId: "",
      notes: "",
      visibility: "private",
      status: "draft",
    },
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
