import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { PlayersDialog } from "./PlayersDialog";
import type { PlayersDialogPlayer } from "./PlayersDialog.types";

const editPlayer: PlayersDialogPlayer = {
  id: "player-jose",
  displayName: "José",
  nickname: null,
  facebookName: null,
  facebookUrl: null,
  notes: null,
};

const meta: Meta<typeof PlayersDialog> = {
  title: "Playmates/Players/PlayersDialog",
  component: PlayersDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof PlayersDialog>;

export const Create: Story = {
  render: function CreateStory() {
    const [open, setOpen] = useState(true);
    return <PlayersDialog open={open} onOpenChange={setOpen} />;
  },
};

export const Edit: Story = {
  render: function EditStory() {
    const [open, setOpen] = useState(true);
    return <PlayersDialog open={open} onOpenChange={setOpen} player={editPlayer} />;
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
  render: function DarkStory() {
    const [open, setOpen] = useState(true);
    return <PlayersDialog open={open} onOpenChange={setOpen} />;
  },
};
