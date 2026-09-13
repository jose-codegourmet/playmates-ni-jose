import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OrganizeDndProvider } from "../game-recording-board/OrganizeDndProvider";

import { RecordingCard } from "./RecordingCard";
import type { RecordingCardProps } from "./RecordingCard.types";

const unassignedArgs: RecordingCardProps = {
  id: "rec-unassigned",
  originalFilename: "IMG_1001.mov",
  sizeBytes: 184_549_376,
  durationSeconds: 612,
  cameraSide: "UNASSIGNED",
  partNumber: 1,
};

const meta: Meta<typeof RecordingCard> = {
  title: "Playmates/RecordingCard",
  component: RecordingCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: unassignedArgs,
  decorators: [
    (Story) => (
      <OrganizeDndProvider>
        <div className="w-[28rem] max-w-full bg-background text-foreground">
          <Story />
        </div>
      </OrganizeDndProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RecordingCard>;

export const Unassigned: Story = {};

export const MoveToSelect: Story = {
  args: {
    ...unassignedArgs,
    droppableId: "unassigned",
    moveTargets: [
      { value: "unassigned", label: "Unassigned" },
      { value: "game:g1:A", label: "Game 1 · Side A" },
      { value: "game:g2:B", label: "Game 2 · Side B" },
    ],
    onMoveTo: () => undefined,
  },
};

export const SideBPart2: Story = {
  args: {
    id: "rec-side-b-part-2",
    originalFilename: "IMG_2002.mov",
    displayName: "Game 4 - Side B - Part 2",
    sizeBytes: 251_658_240,
    durationSeconds: 548,
    cameraSide: "B",
    partNumber: 2,
    partCount: 2,
    gameLabel: "Game 4",
  },
};

export const MissingDuration: Story = {
  args: {
    id: "rec-missing-duration",
    originalFilename: "IMG_1008.mov",
    sizeBytes: 92_274_688,
    cameraSide: "A",
    partNumber: 1,
    gameLabel: "Game 1",
  },
};

export const LongFilename: Story = {
  args: {
    id: "rec-long-filename",
    originalFilename:
      "2026-09-09-wednesday-night-smash-court-qc-game-07-side-a-part-01-extra-long-camera-roll-clip.mov",
    sizeBytes: 1_073_741_824,
    durationSeconds: 1804,
    cameraSide: "UNASSIGNED",
    partNumber: 1,
  },
};

export const Dark: Story = {
  args: {
    id: "rec-dark",
    originalFilename: "IMG_2002.mov",
    displayName: "Game 4 - Side B - Part 2",
    sizeBytes: 251_658_240,
    durationSeconds: 548,
    cameraSide: "B",
    partNumber: 2,
    partCount: 2,
    gameLabel: "Game 4",
  },
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
