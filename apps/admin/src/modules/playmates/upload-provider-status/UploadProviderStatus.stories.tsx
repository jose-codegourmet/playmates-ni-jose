import type { Provider, UploadJobStatus } from "@fe-template/mocks";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { UploadProviderStatus } from "./UploadProviderStatus";
import type { UploadProviderStatusProps } from "./UploadProviderStatus.types";

const providers = ["google_drive", "youtube"] as const satisfies readonly Provider[];

function storyArgs(
  provider: Provider,
  status: UploadJobStatus,
  extras: Partial<UploadProviderStatusProps> = {},
): UploadProviderStatusProps {
  return { provider, status, ...extras };
}

const meta: Meta<typeof UploadProviderStatus> = {
  title: "Playmates/UploadProviderStatus",
  component: UploadProviderStatus,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: storyArgs("google_drive", "queued"),
  decorators: [
    (Story) => (
      <div className="w-[20rem] max-w-full bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UploadProviderStatus>;

export const GoogleDriveQueued: Story = {
  args: storyArgs("google_drive", "queued"),
};

export const GoogleDriveUploading: Story = {
  args: storyArgs("google_drive", "uploading", { progressPercent: 42 }),
};

export const GoogleDriveProcessing: Story = {
  args: storyArgs("google_drive", "processing", { progressPercent: 80 }),
};

export const GoogleDriveCompleted: Story = {
  args: storyArgs("google_drive", "completed", {
    assetUrl: "https://example.com/drive/drv-mock-abcd1234",
  }),
};

export const GoogleDriveFailed: Story = {
  args: storyArgs("google_drive", "failed", {
    errorMessage: "Drive quota exceeded. Retry after freeing space.",
  }),
};

export const GoogleDriveCancelled: Story = {
  args: storyArgs("google_drive", "cancelled"),
};

export const YoutubeQueued: Story = {
  args: storyArgs("youtube", "queued"),
};

export const YoutubeUploading: Story = {
  args: storyArgs("youtube", "uploading", { progressPercent: 42 }),
};

export const YoutubeProcessing: Story = {
  args: storyArgs("youtube", "processing", { progressPercent: 80 }),
};

export const YoutubeCompleted: Story = {
  args: storyArgs("youtube", "completed", {
    assetUrl: "https://www.youtube.com/watch?v=MOCKabcd1234",
  }),
};

export const YoutubeFailed: Story = {
  args: storyArgs("youtube", "failed", {
    errorMessage: "YouTube rejected the upload. Check the video title and retry.",
  }),
};

export const YoutubeCancelled: Story = {
  args: storyArgs("youtube", "cancelled"),
};

export const Dark: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {providers.map((provider) => (
        <UploadProviderStatus
          key={provider}
          provider={provider}
          status="uploading"
          progressPercent={42}
        />
      ))}
      <UploadProviderStatus
        provider="google_drive"
        status="failed"
        errorMessage="Drive quota exceeded. Retry after freeing space."
      />
    </div>
  ),
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
