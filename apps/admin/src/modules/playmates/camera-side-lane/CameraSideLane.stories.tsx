import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OrganizeDndProvider } from "../game-recording-board/OrganizeDndProvider";
import type { RecordingCardProps } from "../recording-card/RecordingCard.types";
import { CameraSideLane } from "./CameraSideLane";

const sideARecordings: RecordingCardProps[] = [
  {
    id: "rec-g1-a-1",
    originalFilename: "IMG_1001.mov",
    sizeBytes: 184_549_376,
    durationSeconds: 612,
    cameraSide: "A",
    partNumber: 1,
    partCount: 2,
    gameLabel: "Game 1",
  },
  {
    id: "rec-g1-a-2",
    originalFilename: "IMG_1002.mov",
    displayName: "Game 1 - Side A - Part 2",
    sizeBytes: 201_326_592,
    durationSeconds: 598,
    cameraSide: "A",
    partNumber: 2,
    partCount: 2,
    gameLabel: "Game 1",
  },
];

const sideBRecordings: RecordingCardProps[] = [
  {
    id: "rec-g4-b-1",
    originalFilename: "IMG_2001.mov",
    sizeBytes: 220_200_960,
    durationSeconds: 540,
    cameraSide: "B",
    partNumber: 1,
    partCount: 3,
    gameLabel: "Game 4",
  },
  {
    id: "rec-g4-b-2",
    originalFilename: "IMG_2002.mov",
    displayName: "Game 4 - Side B - Part 2",
    sizeBytes: 251_658_240,
    durationSeconds: 548,
    cameraSide: "B",
    partNumber: 2,
    partCount: 3,
    gameLabel: "Game 4",
  },
  {
    id: "rec-g4-b-3",
    originalFilename: "IMG_2003.mov",
    sizeBytes: 92_274_688,
    cameraSide: "B",
    partNumber: 3,
    partCount: 3,
    gameLabel: "Game 4",
  },
];

const meta: Meta<typeof CameraSideLane> = {
  title: "Playmates/CameraSideLane",
  component: CameraSideLane,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    side: "A",
    droppableId: "game:story:A",
    recordings: [],
  },
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
type Story = StoryObj<typeof CameraSideLane>;

export const EmptyLane: Story = {
  args: {
    side: "A",
    recordings: [],
  },
};

export const SideAWithTwoRecordings: Story = {
  args: {
    side: "A",
    recordings: sideARecordings,
  },
};

export const SideBWithPart2: Story = {
  args: {
    side: "B",
    recordings: sideBRecordings,
  },
};

export const Dark: Story = {
  args: {
    side: "B",
    recordings: sideBRecordings,
  },
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
