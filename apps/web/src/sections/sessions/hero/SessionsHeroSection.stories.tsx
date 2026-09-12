import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionsHeroSection } from "./SessionsHeroSection";

const meta: Meta<typeof SessionsHeroSection> = {
  title: "Sections/Sessions/SessionsHeroSection",
  component: SessionsHeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SessionsHeroSection>;

export const Default: Story = {};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
