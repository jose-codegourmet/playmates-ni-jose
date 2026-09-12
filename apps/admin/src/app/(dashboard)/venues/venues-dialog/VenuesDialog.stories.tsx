import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { VenuesDialog } from "./VenuesDialog";
import type { VenuesDialogVenue } from "./VenuesDialog.types";

const editVenue: VenuesDialogVenue = {
  id: "bbbbbbbb-0002-4000-8000-000000000001",
  name: "Smash Court QC",
  address: "Quezon City",
  notes: null,
};

const meta: Meta<typeof VenuesDialog> = {
  title: "Playmates/Venues/VenuesDialog",
  component: VenuesDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof VenuesDialog>;

export const Create: Story = {
  render: function CreateStory() {
    const [open, setOpen] = useState(true);
    return <VenuesDialog open={open} onOpenChange={setOpen} />;
  },
};

export const Edit: Story = {
  render: function EditStory() {
    const [open, setOpen] = useState(true);
    return <VenuesDialog open={open} onOpenChange={setOpen} venue={editVenue} />;
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
  render: function DarkStory() {
    const [open, setOpen] = useState(true);
    return <VenuesDialog open={open} onOpenChange={setOpen} />;
  },
};
