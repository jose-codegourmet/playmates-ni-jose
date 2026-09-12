import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayersStripSection } from "./PlayersStripSection";
import type { PlayersStripSectionProps } from "./PlayersStripSection.types";

const defaultArgs: PlayersStripSectionProps = {
  players: [
    {
      href: "/players/jose",
      displayName: "José",
      nickname: "José",
      sessionCount: 2,
      initials: "J",
    },
    {
      href: "/players/carlo",
      displayName: "Carlo",
      sessionCount: 2,
      initials: "C",
    },
    {
      href: "/players/mika",
      displayName: "Mika",
      sessionCount: 2,
      initials: "M",
    },
    {
      href: "/players/marco",
      displayName: "Marco",
      sessionCount: 2,
      initials: "M",
    },
  ],
};

const meta: Meta<typeof PlayersStripSection> = {
  title: "Sections/Home/PlayersStripSection",
  component: PlayersStripSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof PlayersStripSection>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    players: [],
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
