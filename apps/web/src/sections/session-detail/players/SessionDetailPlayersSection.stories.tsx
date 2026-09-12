import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionDetailPlayersSection } from "./SessionDetailPlayersSection";
import type { SessionDetailPlayersSectionProps } from "./SessionDetailPlayersSection.types";

const defaultArgs: SessionDetailPlayersSectionProps = {
  players: [
    { href: "/players/jose", displayName: "José", nickname: "Jose", initials: "J" },
    { href: "/players/carlo", displayName: "Carlo", initials: "C" },
    { href: "/players/mika", displayName: "Mika", initials: "M" },
    { href: "/players/marco", displayName: "Marco", initials: "M" },
    { href: "/players/ana", displayName: "Ana", initials: "A" },
    { href: "/players/luis", displayName: "Luis", initials: "L" },
    { href: "/players/bea", displayName: "Bea", initials: "B" },
    { href: "/players/nico", displayName: "Nico", initials: "N" },
  ],
};

const meta: Meta<typeof SessionDetailPlayersSection> = {
  title: "Sections/SessionDetail/SessionDetailPlayersSection",
  component: SessionDetailPlayersSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof SessionDetailPlayersSection>;

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
