import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionPublishChecklist } from "./SessionPublishChecklist";
import type {
  SessionPublishChecklistGame,
  SessionPublishChecklistProps,
} from "./SessionPublishChecklist.types";

const allGreenGames: SessionPublishChecklistGame[] = [
  {
    id: "game_1",
    gameNumber: 1,
    matchup: "José & Carlo vs Mika & Marco",
    youtubeStatus: "completed",
    driveStatus: "completed",
    visibility: "public",
  },
  {
    id: "game_2",
    gameNumber: 2,
    matchup: "Ana & Luis vs Bea & Nico",
    youtubeStatus: "completed",
    driveStatus: "completed",
    visibility: "public",
  },
];

const missingYoutubeGames: SessionPublishChecklistGame[] = [
  allGreenGames[0],
  {
    id: "game_2",
    gameNumber: 2,
    matchup: "Ana & Luis vs Bea & Nico",
    youtubeStatus: null,
    driveStatus: "completed",
    visibility: "private",
  },
];

const missingBothGames: SessionPublishChecklistGame[] = [
  allGreenGames[0],
  {
    id: "game_2",
    gameNumber: 2,
    matchup: "Ana & Luis vs Bea & Nico",
    youtubeStatus: null,
    driveStatus: null,
    visibility: "private",
  },
];

const meta: Meta<typeof SessionPublishChecklist> = {
  title: "Playmates/SessionPublishChecklist",
  component: SessionPublishChecklist,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    games: allGreenGames,
    onPublishGame: () => {},
    onPublishAll: () => {},
  } satisfies SessionPublishChecklistProps,
  decorators: [
    (Story) => (
      <div className="w-[32rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionPublishChecklist>;

export const AllGreen: Story = {
  args: { games: allGreenGames },
};

export const MissingYoutubeOnOneGame: Story = {
  args: { games: missingYoutubeGames },
};

export const MissingBothOnOneGame: Story = {
  args: { games: missingBothGames },
};

export const NothingPublishableYet: Story = {
  args: { games: [] },
};

export const Dark: Story = {
  args: { games: missingYoutubeGames },
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
