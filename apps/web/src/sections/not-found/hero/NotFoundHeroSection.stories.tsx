import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotFoundHeroSection } from "./NotFoundHeroSection";

const meta: Meta<typeof NotFoundHeroSection> = {
  title: "Sections/NotFound/NotFoundHeroSection",
  component: NotFoundHeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NotFoundHeroSection>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    className: "py-8",
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
