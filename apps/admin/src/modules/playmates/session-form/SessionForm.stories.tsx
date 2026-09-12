import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionForm } from "./SessionForm";

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

const players = [
  { id: "aaaaaaaa-0001-4000-8000-000000000001", displayName: "José" },
  { id: "aaaaaaaa-0001-4000-8000-000000000002", displayName: "Carlo" },
  { id: "aaaaaaaa-0001-4000-8000-000000000003", displayName: "Mika" },
];

const meta: Meta<typeof SessionForm> = {
  title: "Playmates/Sessions/SessionForm",
  component: SessionForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    venues,
    courts,
    players,
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
type Story = StoryObj<typeof SessionForm>;

export const Default: Story = {};

export const VenueSelected: Story = {
  args: {
    defaultValues: {
      sessionDate: "2026-09-12",
      venueId: "bbbbbbbb-0002-4000-8000-000000000001",
    },
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
