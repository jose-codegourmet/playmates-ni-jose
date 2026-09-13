import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionImport } from "./SessionImport";
import type { SessionImportRecording } from "./SessionImport.types";

const recordings: SessionImportRecording[] = [
  {
    id: "rec-1",
    originalFilename: "IMG_1001.mp4",
    mimeType: "video/mp4",
    sizeBytes: 12_345_678,
    localLastModifiedAt: "2026-09-09T10:00:00.000Z",
    gameId: null,
    cameraSide: "UNASSIGNED",
  },
  {
    id: "rec-2",
    originalFilename: "IMG_2001.mov",
    mimeType: "video/quicktime",
    sizeBytes: 22_000_000,
    localLastModifiedAt: "2026-09-09T10:05:00.000Z",
    gameId: "game-1",
    cameraSide: "A",
  },
  {
    id: "rec-3",
    originalFilename: "notes.txt",
    mimeType: "text/plain",
    sizeBytes: 128,
    localLastModifiedAt: "2026-09-09T10:06:00.000Z",
    gameId: null,
    cameraSide: "UNASSIGNED",
  },
];

const meta: Meta<typeof SessionImport> = {
  title: "Playmates/Sessions/SessionImport",
  component: SessionImport,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    sessionId: "dddddddd-0004-4000-8000-000000000001",
    recordings,
    games: [{ id: "game-1", gameNumber: 1 }],
  },
  decorators: [
    (Story) => (
      <div className="w-[64rem] max-w-full bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionImport>;

export const WithRows: Story = {};

export const Empty: Story = {
  args: {
    recordings: [],
    games: [],
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
