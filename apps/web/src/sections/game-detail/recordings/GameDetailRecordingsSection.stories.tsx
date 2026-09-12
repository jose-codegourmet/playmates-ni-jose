import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GameDetailRecordingsSection } from "./GameDetailRecordingsSection";
import type { GameDetailRecordingsSectionProps } from "./GameDetailRecordingsSection.types";

const defaultArgs: GameDetailRecordingsSectionProps = {
  groups: [
    {
      side: "A",
      heading: "Side A",
      recordings: [
        {
          id: "rec-a1",
          label: "Side A · Part 1",
          partNumber: 1,
          filename: "IMG_1004.MOV",
          embedUrl: "https://example.com/yt/yt-g4-A-p1/embed",
          driveUrl: "https://example.com/drive/drv-g4-A-p1",
          embedTitle: "Game 4 Side A",
        },
      ],
    },
    {
      side: "B",
      heading: "Side B",
      recordings: [
        {
          id: "rec-b1",
          label: "Side B · Part 1",
          partNumber: 1,
          filename: "IMG_1005.MOV",
          embedUrl: "https://example.com/yt/yt-g4-B-p1/embed",
          driveUrl: "https://example.com/drive/drv-g4-B-p1",
          embedTitle: "Game 4 Side B Part 1",
        },
        {
          id: "rec-b2",
          label: "Side B · Part 2",
          partNumber: 2,
          filename: "IMG_1006.MOV",
          embedUrl: "https://example.com/yt/yt-g4-B-p2/embed",
          driveUrl: "https://example.com/drive/drv-g4-B-p2",
          embedTitle: "Game 4 Side B Part 2",
        },
      ],
    },
  ],
};

const meta: Meta<typeof GameDetailRecordingsSection> = {
  title: "Sections/GameDetail/GameDetailRecordingsSection",
  component: GameDetailRecordingsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof GameDetailRecordingsSection>;

export const MultiPartSideB: Story = {};

export const SingleRecording: Story = {
  args: {
    groups: [
      {
        side: "A",
        heading: "Side A",
        recordings: [
          {
            id: "rec-g8",
            label: "Side A · Part 1",
            partNumber: 1,
            filename: "IMG_1018.MOV",
            embedUrl: "https://example.com/yt/yt-g8-A-p1/embed",
            driveUrl: "https://example.com/drive/drv-g8-A-p1",
            embedTitle: "Game 8 Side A",
          },
        ],
      },
    ],
  },
};

export const DriveOnly: Story = {
  args: {
    groups: [
      {
        side: "A",
        heading: "Side A",
        recordings: [
          {
            id: "rec-drive",
            label: "Side A · Part 1",
            partNumber: 1,
            filename: "IMG_1001.MOV",
            driveUrl: "https://example.com/drive/drv-g1-A-p1",
            embedTitle: "Game 1 Side A",
          },
        ],
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    groups: [],
  },
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
