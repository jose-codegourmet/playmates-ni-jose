import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { HomeHeroSection } from "./HomeHeroSection";
import type { CalendarSession } from "./HomeHeroSection.types";

const session: CalendarSession = {
  id: "rk-session",
  date: "2026-09-14",
  title: "Monday badminton",
  venue: "RK Sports Center",
  address: "Davao City",
  court: "Court 2",
  club: "Monday Club",
  notes: null,
  games: [
    {
      id: "game-1",
      number: 1,
      title: null,
      notes: null,
      format: "Doubles",
      teams: [
        { number: 1, label: "Team 1", players: ["José", "Carlo"] },
        { number: 2, label: "Team 2", players: ["Mika", "Ana"] },
      ],
      winnerTeamNo: 1,
      scores: null,
      recordings: [
        {
          id: "a",
          side: "A",
          part: 1,
          youtubeUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
          embedUrl: "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
          driveUrl: "https://drive.google.com/file/d/example-a/view",
        },
        { id: "b", side: "B", part: 1, driveUrl: "https://drive.google.com/file/d/example-b/view" },
      ],
    },
  ],
};
const meta: Meta<typeof HomeHeroSection> = {
  title: "Sections/Home/HomeHeroSection",
  component: HomeHeroSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { today: "2026-09-14", sessions: [session] },
};
export default meta;
type Story = StoryObj<typeof HomeHeroSection>;
export const Default: Story = {};
export const Empty: Story = { args: { sessions: [] } };
export const MultipleSessions: Story = {
  args: {
    sessions: [
      session,
      { ...session, id: "evening", venue: "Evening session" },
      { ...session, id: "third", venue: "Third session" },
    ],
  },
};
export const Dark: Story = { globals: { theme: "dark" } };
export const SessionToGame: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /RK Sports Center, Monday/ }));
    const body = within(canvasElement.ownerDocument.body);
    const dialog = within(await body.findByRole("dialog"));
    await expect(canvasElement.ownerDocument.querySelectorAll('[data-slot="avatar"]')).toHaveLength(
      4,
    );
    await userEvent.click(dialog.getByRole("button", { name: /José & Carlo vs Mika & Ana/ }));
    await expect(dialog.getByText("Winner")).toBeVisible();
    await expect(dialog.getByTitle("Game 1 · Side A · Part 1")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
    );
    await expect(dialog.getByRole("link", { name: "Google Drive" })).toHaveAttribute(
      "href",
      "https://drive.google.com/file/d/example-a/view",
    );
    await userEvent.click(dialog.getByRole("button", { name: "Side B", exact: true }));
    await expect(dialog.getByRole("link", { name: "Google Drive" })).toHaveAttribute(
      "href",
      "https://drive.google.com/file/d/example-b/view",
    );
    await expect(dialog.getByText("No video yet")).toBeVisible();
    await userEvent.click(dialog.getByRole("button", { name: "Back to session" }));
    await expect(dialog.getByText("Monday badminton")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole("button", { name: "Next month" }));
    await expect(canvas.getByRole("heading", { name: "October 2026" })).toBeVisible();
    await expect(
      canvas.queryByRole("button", { name: /RK Sports Center, Monday/ }),
    ).not.toBeInTheDocument();
  },
};
