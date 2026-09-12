import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VenueCard } from "./VenueCard";
import type { VenueCardProps } from "./VenueCard.types";

const defaultArgs: VenueCardProps = {
  href: "/venues/the-fort",
  name: "The Fort",
  address: "BGC, Taguig",
  sessionCount: 6,
};

const meta: Meta<typeof VenueCard> = {
  title: "Shared/VenueCard",
  component: VenueCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof VenueCard>;

export const Default: Story = {};

export const NoAddress: Story = {
  args: {
    href: "/venues/home-court",
    name: "Home Court",
    address: undefined,
    sessionCount: 3,
  },
};

export const ZeroSessions: Story = {
  args: {
    href: "/venues/new-gym",
    name: "New Gym",
    address: "Makati",
    sessionCount: 0,
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
