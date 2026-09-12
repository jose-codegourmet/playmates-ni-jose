import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayersGridSection } from "./PlayersGridSection";
import type { PlayersGridSectionProps } from "./PlayersGridSection.types";

const defaultArgs: PlayersGridSectionProps = {
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
    {
      href: "/players/ana",
      displayName: "Ana",
      sessionCount: 1,
      initials: "A",
    },
  ],
};

const meta: Meta<typeof PlayersGridSection> = {
  title: "Sections/Players/PlayersGridSection",
  component: PlayersGridSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof PlayersGridSection>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    players: [],
  },
};

export const WithArchived: Story = {
  args: {
    players: [
      ...defaultArgs.players,
      {
        href: "/players/archived-playmate",
        displayName: "Archived playmate",
        sessionCount: 1,
        initials: "A",
        isArchived: true,
      },
    ],
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
