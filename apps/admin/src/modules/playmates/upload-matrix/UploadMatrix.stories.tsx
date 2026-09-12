import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { UploadMatrix } from "./UploadMatrix";
import type { UploadMatrixProps, UploadMatrixRow } from "./UploadMatrix.types";

const fullMatrixRows: UploadMatrixRow[] = [
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

const failureRows: UploadMatrixRow[] = [
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
    drive: {
      provider: "google_drive",
      status: "failed",
      errorMessage: "Drive quota exceeded. Retry after freeing space.",
    },
    youtube: { provider: "youtube", status: "completed" },
  },
];

const singleRow: UploadMatrixRow[] = [
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

const meta: Meta<typeof UploadMatrix> = {
  title: "Playmates/UploadMatrix",
  component: UploadMatrix,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    rows: fullMatrixRows,
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
