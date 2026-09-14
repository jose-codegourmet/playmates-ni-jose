import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const WordmarkOnCream: Story = {
  args: {
    title: "Playmates ni José",
    className: "h-12 w-auto text-brand-green",
  },
  decorators: [
    (Story) => (
      <div className="bg-brand-cream p-8">
        <Story />
      </div>
    ),
  ],
};

export const WordmarkOnGreen: Story = {
  args: {
    title: "Playmates ni José",
    className: "h-12 w-auto text-brand-cream",
  },
  decorators: [
    (Story) => (
      <div className="bg-brand-green p-8">
        <Story />
      </div>
    ),
  ],
};

export const FillOverride: Story = {
  args: {
    title: "Playmates ni José",
    fill: "#e97864",
    className: "h-12 w-auto",
  },
};

export const Mark: Story = {
  args: {
    variant: "mark",
    title: "Playmates ni José",
    className: "size-10 text-brand-green",
  },
};
