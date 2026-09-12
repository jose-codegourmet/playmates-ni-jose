import type { Player, Venue } from "@fe-template/mocks";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import type { PublicSessionFilters } from "@/hooks/use-public-sessions/types";

import { SessionsFiltersSection } from "./SessionsFiltersSection";
import type { SessionsFiltersSectionProps } from "./SessionsFiltersSection.types";

const players: Player[] = [
  {
    id: "player-jose",
    displayName: "José",
    slug: "jose",
    nickname: null,
    facebookName: null,
    facebookUrl: null,
    notes: null,
    isArchived: false,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "player-carlo",
    displayName: "Carlo",
    slug: "carlo",
    nickname: null,
    facebookName: null,
    facebookUrl: null,
    notes: null,
    isArchived: false,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
];

const venues: Venue[] = [
  {
    id: "venue-smash",
    name: "Smash Court QC",
    slug: "smash-court-qc",
    address: null,
    notes: null,
    isArchived: false,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "venue-green",
    name: "Green Shuttle Pasig",
    slug: "green-shuttle-pasig",
    address: null,
    notes: null,
    isArchived: false,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
];

const defaultArgs: SessionsFiltersSectionProps = {
  players,
  venues,
  value: {},
  onChange: () => undefined,
};

const meta: Meta<typeof SessionsFiltersSection> = {
  title: "Sections/Sessions/SessionsFiltersSection",
  component: SessionsFiltersSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
  render: function Render(args) {
    const [value, setValue] = useState<PublicSessionFilters>(args.value);
    return <SessionsFiltersSection {...args} value={value} onChange={setValue} />;
  },
};

export default meta;
type Story = StoryObj<typeof SessionsFiltersSection>;

export const Default: Story = {};

export const SecondVenue: Story = {
  args: {
    value: { venue: "Green Shuttle Pasig" },
  },
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
