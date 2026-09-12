import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GameDetailPagerSection } from "./GameDetailPagerSection";
import type { GameDetailPagerSectionProps } from "./GameDetailPagerSection.types";

const defaultArgs: GameDetailPagerSectionProps = {
  previous: { href: "/games/2026-09-09-game-3", gameNumber: 3 },
  next: { href: "/games/2026-09-09-game-5", gameNumber: 5 },
};

const meta: Meta<typeof GameDetailPagerSection> = {
  title: "Sections/GameDetail/GameDetailPagerSection",
  component: GameDetailPagerSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof GameDetailPagerSection>;

export const Default: Story = {};

export const PreviousOnly: Story = {
  args: {
    next: undefined,
  },
};

export const NextOnly: Story = {
  args: {
    previous: undefined,
  },
};

export const HiddenWhenEmpty: Story = {
  args: {
    previous: undefined,
    next: undefined,
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
