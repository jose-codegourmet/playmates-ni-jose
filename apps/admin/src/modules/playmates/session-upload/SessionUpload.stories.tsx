import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionWorkspaceSaveProvider } from "../session-workspace-header/SessionWorkspaceSaveContext";
import { SessionUpload } from "./SessionUpload";
import {
  emptyUploadFixture,
  incompleteJobsFixture,
  sep9CompletedFixture,
} from "./session-upload.fixture";

const meta: Meta<typeof SessionUpload> = {
  title: "Playmates/Sessions/SessionUpload",
  component: SessionUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: { ...sep9CompletedFixture, enableJobPolling: false },
  decorators: [
    (Story) => (
      <SessionWorkspaceSaveProvider>
        <div className="w-[64rem] max-w-full bg-background p-4 text-foreground">
          <Story />
        </div>
      </SessionWorkspaceSaveProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionUpload>;

export const Sep9CompletedAssets: Story = {};

export const EmptySession: Story = {
  args: emptyUploadFixture,
};

export const IncompleteJobsNeedReselect: Story = {
  args: incompleteJobsFixture,
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
