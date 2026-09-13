import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { UploadMatrix } from "./UploadMatrix";
import type { UploadMatrixProps, UploadMatrixRow } from "./UploadMatrix.types";

const fullMatrixRows: UploadMatrixRow[] = [
  {
    recordingId: "rec-g1-a",
    recordingLabel: "G1 Side A",
    drive: { provider: "google_drive", status: "uploading", progressPercent: 72, jobId: "job-1" },
    youtube: { provider: "youtube", status: "queued" },
  },
  {
    recordingId: "rec-g1-b",
    recordingLabel: "G1 Side B",
    drive: {
      provider: "google_drive",
      status: "completed",
      assetUrl: "https://example.com/drive/drv-mock-g1b",
    },
    youtube: { provider: "youtube", status: "processing", progressPercent: 40, jobId: "job-2" },
  },
  {
    recordingId: "rec-g2-a",
    recordingLabel: "G2 Side A",
    drive: { provider: "google_drive", status: "initiating", jobId: "job-3" },
    youtube: { provider: "youtube", status: "cancelled", jobId: "job-4" },
  },
];

const failureRows: UploadMatrixRow[] = [
  {
    recordingId: "rec-g1-a",
    recordingLabel: "G1 Side A",
    drive: { provider: "google_drive", status: "uploading", progressPercent: 72, jobId: "job-1" },
    youtube: { provider: "youtube", status: "queued" },
  },
  {
    recordingId: "rec-g1-b",
    recordingLabel: "G1 Side B",
    drive: {
      provider: "google_drive",
      status: "completed",
      assetUrl: "https://example.com/drive/drv-mock-g1b",
    },
    youtube: { provider: "youtube", status: "processing", progressPercent: 40, jobId: "job-2" },
  },
  {
    recordingId: "rec-g2-a",
    recordingLabel: "G2 Side A",
    drive: {
      provider: "google_drive",
      status: "failed",
      errorMessage: "Drive quota exceeded. Retry after freeing space.",
      lastErrorCode: "DRIVE_QUOTA",
      jobId: "job-5",
    },
    youtube: { provider: "youtube", status: "completed" },
  },
];

const singleRow: UploadMatrixRow[] = [
  {
    recordingId: "rec-g2-a",
    recordingLabel: "G2 Side A",
    drive: {
      provider: "google_drive",
      status: "failed",
      errorMessage: "Drive quota exceeded. Retry after freeing space.",
      lastErrorCode: "DRIVE_QUOTA",
      jobId: "job-5",
    },
    youtube: { provider: "youtube", status: "completed" },
  },
];

const meta: Meta<typeof UploadMatrix> = {
  title: "Playmates/UploadMatrix",
  component: UploadMatrix,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    rows: fullMatrixRows,
    onRetryJob: () => undefined,
    onCancelJob: () => undefined,
    onReplace: () => undefined,
    onCopyError: () => undefined,
  } satisfies UploadMatrixProps,
  decorators: [
    (Story) => (
      <div className="w-[48rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UploadMatrix>;

export const FullMatrix: Story = {
  args: { rows: fullMatrixRows },
};

export const MatrixWithFailures: Story = {
  args: { rows: failureRows },
};

export const SingleRow: Story = {
  args: { rows: singleRow },
};

export const Empty: Story = {
  args: { rows: [] },
};

export const Dark: Story = {
  args: { rows: failureRows },
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
