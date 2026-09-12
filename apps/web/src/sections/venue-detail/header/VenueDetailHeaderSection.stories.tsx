import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VenueDetailHeaderSection } from "./VenueDetailHeaderSection";
import type { VenueDetailHeaderSectionProps } from "./VenueDetailHeaderSection.types";

const defaultArgs: VenueDetailHeaderSectionProps = {
  name: "Smash Court QC",
  address: "Quezon City",
};

const meta: Meta<typeof VenueDetailHeaderSection> = {
  title: "Sections/VenueDetail/VenueDetailHeaderSection",
  component: VenueDetailHeaderSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof VenueDetailHeaderSection>;

export const Default: Story = {};

export const WithNotes: Story = {
  args: {
    notes: "Two courts, evening sessions.",
  },
};

export const NameOnly: Story = {
  args: {
    address: undefined,
    notes: undefined,
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
