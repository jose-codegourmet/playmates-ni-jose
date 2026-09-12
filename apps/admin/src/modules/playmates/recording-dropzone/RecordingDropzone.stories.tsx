import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RecordingDropzone } from "./RecordingDropzone";
import type { RecordingDropzoneFileMeta } from "./RecordingDropzone.types";

const threeFiles: RecordingDropzoneFileMeta[] = [
  { name: "IMG_1001.mov", sizeBytes: 184_549_376, durationSeconds: 612 },
  { name: "IMG_2001.mov", sizeBytes: 201_326_592, durationSeconds: 598 },
  { name: "IMG_1002.mp4", sizeBytes: 92_274_688 },
];

const meta: Meta<typeof RecordingDropzone> = {
  title: "Playmates/RecordingDropzone",
  component: RecordingDropzone,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    onFiles: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[36rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RecordingDropzone>;

export const Empty: Story = {};

export const DragActive: Story = {
  args: {
    dragActive: true,
  },
};

export const ThreeListedFiles: Story = {
  args: {
    filesMeta: threeFiles,
  },
};

export const Dark: Story = {
  args: {
    filesMeta: threeFiles,
  },
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
