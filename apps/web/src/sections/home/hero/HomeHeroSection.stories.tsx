import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HomeHeroSection } from "./HomeHeroSection";
import type { HomeHeroPortrait, HomeHeroSectionProps } from "./HomeHeroSection.types";

const PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const portraits: HomeHeroPortrait[] = [
  { name: "José", src: PLACEHOLDER, alt: "José" },
  { name: "Carlo", src: PLACEHOLDER, alt: "Carlo" },
  { name: "Mika", src: PLACEHOLDER, alt: "Mika" },
  { name: "Marco", src: PLACEHOLDER, alt: "Marco" },
  { name: "Ana", src: PLACEHOLDER, alt: "Ana" },
];

const defaultArgs: HomeHeroSectionProps = {
  sessionCount: 2,
  gameCount: 12,
  portraits,
};

const meta: Meta<typeof HomeHeroSection> = {
  title: "Sections/Home/HomeHeroSection",
  component: HomeHeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof HomeHeroSection>;

export const Default: Story = {};

export const NoCounts: Story = {
  args: {
    sessionCount: 0,
    gameCount: 0,
  },
};

export const NoPortraits: Story = {
  args: {
    portraits: [],
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
