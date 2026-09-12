import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GameDetailLinksSection } from "./GameDetailLinksSection";
import type { GameDetailLinksSectionProps } from "./GameDetailLinksSection.types";

const defaultArgs: GameDetailLinksSectionProps = {
  assets: [
    {
      provider: "google_drive",
      url: "https://example.com/drive/drv-g4-B-p1",
      label: "IMG_1005.MOV",
    },
    {
      provider: "youtube",
      url: "https://example.com/yt/yt-g4-B-p1",
      label: "Side B · Part 1",
    },
    {
      provider: "youtube",
      url: "https://example.com/yt/yt-g4-B-p2",
      label: "Side B · Part 2",
    },
  ],
};

const meta: Meta<typeof GameDetailLinksSection> = {
  title: "Sections/GameDetail/GameDetailLinksSection",
  component: GameDetailLinksSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof GameDetailLinksSection>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    assets: [],
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
