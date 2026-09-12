import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayerDetailHeaderSection } from "./PlayerDetailHeaderSection";
import type { PlayerDetailHeaderSectionProps } from "./PlayerDetailHeaderSection.types";

const defaultArgs: PlayerDetailHeaderSectionProps = {
  displayName: "José",
  nickname: "José",
};

const meta: Meta<typeof PlayerDetailHeaderSection> = {
  title: "Sections/PlayerDetail/PlayerDetailHeaderSection",
  component: PlayerDetailHeaderSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof PlayerDetailHeaderSection>;

export const Default: Story = {};

export const WithoutNickname: Story = {
  args: {
    nickname: undefined,
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
