import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VenuesHeroSection } from "./VenuesHeroSection";

const meta: Meta<typeof VenuesHeroSection> = {
  title: "Sections/Venues/VenuesHeroSection",
  component: VenuesHeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof VenuesHeroSection>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    className: "pt-6 pb-2",
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
