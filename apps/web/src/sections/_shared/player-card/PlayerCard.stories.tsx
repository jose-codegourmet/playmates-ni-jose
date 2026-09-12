import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayerCard } from "./PlayerCard";
import type { PlayerCardProps } from "./PlayerCard.types";

const withNicknameArgs: PlayerCardProps = {
  href: "/players/jose",
  displayName: "José",
  nickname: "Playmates",
  sessionCount: 12,
  initials: "J",
};

const meta: Meta<typeof PlayerCard> = {
  title: "Shared/PlayerCard",
  component: PlayerCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: withNicknameArgs,
};

export default meta;
type Story = StoryObj<typeof PlayerCard>;

export const WithNickname: Story = {};

export const WithoutNickname: Story = {
  args: {
    href: "/players/carlo",
    displayName: "Carlo",
    nickname: undefined,
    sessionCount: 8,
    initials: "C",
  },
};

export const Archived: Story = {
  args: {
    href: "/players/nico",
    displayName: "Nico",
    nickname: "Nics",
    sessionCount: 3,
    initials: "N",
    isArchived: true,
  },
};

export const HighSessionCount: Story = {
  args: {
    href: "/players/mika",
    displayName: "Mika",
    nickname: "Miks",
    sessionCount: 128,
    initials: "M",
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
