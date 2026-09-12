import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionWorkspaceHeader } from "./SessionWorkspaceHeader";
import type { SessionWorkspaceHeaderProps } from "./SessionWorkspaceHeader.types";

const draftSavedArgs = {
  date: "2026-09-09",
  title: "Tuesday night games",
  venueName: "The Tent, Marikina",
  status: "draft",
  visibility: "private",
  saveState: "saved",
} satisfies SessionWorkspaceHeaderProps;

const meta: Meta<typeof SessionWorkspaceHeader> = {
  title: "Playmates/SessionWorkspaceHeader",
  component: SessionWorkspaceHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: draftSavedArgs,
  decorators: [
    (Story) => (
      <div className="w-[56rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionWorkspaceHeader>;

export const DraftSaved: Story = {
  args: draftSavedArgs,
};

export const PublishingUploadingSaving: Story = {
  args: {
    date: "2026-09-09",
    title: "Tuesday night games",
    venueName: "The Tent, Marikina",
    status: "uploading",
    visibility: "public",
    saveState: "saving",
  },
};

export const ErrorSave: Story = {
  args: {
    date: "2026-09-09",
    title: "Tuesday night games",
    venueName: "The Tent, Marikina",
    status: "organizing",
    visibility: "private",
    saveState: "error",
  },
};

export const MissingTitle: Story = {
  args: {
    date: "2026-09-09",
    title: "",
    venueName: "The Tent, Marikina",
    status: "draft",
    visibility: "private",
    saveState: "saved",
  },
};

export const Dark: Story = {
  args: draftSavedArgs,
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
