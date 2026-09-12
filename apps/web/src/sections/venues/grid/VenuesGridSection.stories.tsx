import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VenuesGridSection } from "./VenuesGridSection";
import type { VenuesGridSectionProps } from "./VenuesGridSection.types";

const defaultArgs: VenuesGridSectionProps = {
  venues: [
    {
      href: "/venues/green-shuttle-pasig",
      name: "Green Shuttle Pasig",
      address: "Pasig",
      sessionCount: 1,
    },
    {
      href: "/venues/smash-court-qc",
      name: "Smash Court QC",
      address: "Quezon City",
      sessionCount: 1,
    },
  ],
};

const meta: Meta<typeof VenuesGridSection> = {
  title: "Sections/Venues/VenuesGridSection",
  component: VenuesGridSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof VenuesGridSection>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    venues: [],
  },
};

export const WithoutAddress: Story = {
  args: {
    venues: [
      {
        href: "/venues/home-court",
        name: "Home Court",
        sessionCount: 3,
      },
    ],
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
