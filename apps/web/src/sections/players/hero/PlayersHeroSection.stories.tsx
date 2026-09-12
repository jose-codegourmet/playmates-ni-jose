import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayersHeroSection } from "./PlayersHeroSection";

const meta: Meta<typeof PlayersHeroSection> = {
  title: "Sections/Players/PlayersHeroSection",
  component: PlayersHeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PlayersHeroSection>;

export const Default: Story = {};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
