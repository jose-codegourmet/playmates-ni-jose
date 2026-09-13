import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { SessionWorkspaceSaveProvider } from "../session-workspace-header/SessionWorkspaceSaveContext";
import { SessionReviewPublish } from "./SessionReviewPublish";
import type { SessionReviewPublishProps } from "./SessionReviewPublish.types";
import {
  emptyReviewFixture,
  missingDraftFixture,
  sep9ReviewFixture,
} from "./session-review-publish.fixture";

function SessionReviewPublishPlayground(props: SessionReviewPublishProps) {
  const [games, setGames] = useState(props.games);
  const [sessionVisibility, setSessionVisibility] = useState(props.sessionVisibility);
  const [sessionStatus, setSessionStatus] = useState(props.sessionStatus);

  return (
    <SessionWorkspaceSaveProvider>
      <SessionReviewPublish
        {...props}
        games={games}
        sessionVisibility={sessionVisibility}
        sessionStatus={sessionStatus}
        onPublishGame={(gameId) => {
          setGames((current) =>
            current.map((game) => (game.id === gameId ? { ...game, visibility: "public" } : game)),
          );
        }}
        onPublishAll={() => {
          setGames((current) => current.map((game) => ({ ...game, visibility: "public" })));
        }}
        onPublishSession={() => {
          setSessionStatus("published");
          setSessionVisibility("public");
        }}
        onUnpublishSession={() => {
          setSessionStatus("ready");
          setSessionVisibility("private");
        }}
        onSetSessionVisibility={(visibility) => {
          setSessionVisibility(visibility);
        }}
        onSetGameVisibility={(gameId, visibility) => {
          setGames((current) =>
            current.map((game) => (game.id === gameId ? { ...game, visibility } : game)),
          );
        }}
      />
    </SessionWorkspaceSaveProvider>
  );
}

const meta: Meta<typeof SessionReviewPublish> = {
  title: "Playmates/Sessions/SessionReviewPublish",
  component: SessionReviewPublish,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: sep9ReviewFixture,
  decorators: [
    (Story) => (
      <div className="mx-auto w-[48rem] max-w-full bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
  render: (args) => <SessionReviewPublishPlayground {...args} />,
};

export default meta;
type Story = StoryObj<typeof SessionReviewPublish>;

export const Sep9TenGamesYoutubeGap: Story = {};

export const EmptySession: Story = {
  args: emptyReviewFixture,
};

export const GeneratePlaceholderDraft: Story = {
  args: missingDraftFixture,
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
