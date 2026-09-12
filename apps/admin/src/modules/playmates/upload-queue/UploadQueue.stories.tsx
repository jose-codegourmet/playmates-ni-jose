import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { UploadQueue } from "./UploadQueue";
import type { UploadQueueItem, UploadQueueProps } from "./UploadQueue.types";

const mixedItems: UploadQueueItem[] = [
  {
    recordingLabel: "G1 Side A",
    drive: { provider: "google_drive", status: "uploading", progressPercent: 72 },
    youtube: { provider: "youtube", status: "queued" },
  },
  {
    recordingLabel: "G1 Side B",
    drive: { provider: "google_drive", status: "completed" },
    youtube: { provider: "youtube", status: "processing", progressPercent: 40 },
  },
  {
    recordingLabel: "G2 Side A",
    drive: { provider: "google_drive", status: "initiating" },
    youtube: { provider: "youtube", status: "cancelled" },
  },
];

const completedItems: UploadQueueItem[] = [
  {
    recordingLabel: "G1 Side A",
    drive: { provider: "google_drive", status: "completed" },
    youtube: { provider: "youtube", status: "completed" },
  },
  {
    recordingLabel: "G1 Side B",
    drive: { provider: "google_drive", status: "completed" },
    youtube: { provider: "youtube", status: "completed" },
  },
];

const failedProviderItems: UploadQueueItem[] = [
  {
    recordingLabel: "G2 Side A",
    drive: {
      provider: "google_drive",
      status: "failed",
      errorMessage: "Drive quota exceeded. Retry after freeing space.",
    },
    youtube: { provider: "youtube", status: "completed" },
  },
];

const meta: Meta<typeof UploadQueue> = {
  title: "Playmates/UploadQueue",
  component: UploadQueue,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    items: mixedItems,
  } satisfies UploadQueueProps,
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UploadQueue>;

export const MixedStates: Story = {
  args: { items: mixedItems },
};

export const AllCompleted: Story = {
  args: { items: completedItems },
};

export const OneFailedProvider: Story = {
  args: { items: failedProviderItems },
};

export const Empty: Story = {
  args: { items: [] },
};

export const Dark: Story = {
  args: { items: mixedItems },
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
