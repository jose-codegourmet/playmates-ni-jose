import type {
  GameStatus,
  RecordingStatus,
  SessionStatus,
  UploadJobStatus,
} from "@fe-template/mocks";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import {
  GAME_STATUS_VARIANT,
  RECORDING_STATUS_VARIANT,
  SESSION_STATUS_VARIANT,
  StatusBadge,
  UPLOAD_JOB_STATUS_VARIANT,
  VisibilityBadge,
} from "./StatusBadge";

function BadgeRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-background p-4 text-foreground">
      {children}
    </div>
  );
}

const meta: Meta<typeof StatusBadge> = {
  title: "Playmates/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const SessionStatuses: Story = {
  render: () => (
    <BadgeRow>
      {(Object.keys(SESSION_STATUS_VARIANT) as SessionStatus[]).map((status) => (
        <StatusBadge key={status} kind="session" status={status} />
      ))}
    </BadgeRow>
  ),
};

export const GameStatuses: Story = {
  render: () => (
    <BadgeRow>
      {(Object.keys(GAME_STATUS_VARIANT) as GameStatus[]).map((status) => (
        <StatusBadge key={status} kind="game" status={status} />
      ))}
    </BadgeRow>
  ),
};

export const RecordingStatuses: Story = {
  render: () => (
    <BadgeRow>
      {(Object.keys(RECORDING_STATUS_VARIANT) as RecordingStatus[]).map((status) => (
        <StatusBadge key={status} kind="recording" status={status} />
      ))}
    </BadgeRow>
  ),
};

export const UploadJobStatuses: Story = {
  render: () => (
    <BadgeRow>
      {(Object.keys(UPLOAD_JOB_STATUS_VARIANT) as UploadJobStatus[]).map((status) => (
        <StatusBadge key={status} kind="upload-job" status={status} />
      ))}
    </BadgeRow>
  ),
};

export const VisibilityPrivate: Story = {
  render: () => (
    <BadgeRow>
      <VisibilityBadge visibility="private" />
    </BadgeRow>
  ),
};

export const VisibilityPublic: Story = {
  render: () => (
    <BadgeRow>
      <VisibilityBadge visibility="public" />
    </BadgeRow>
  ),
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <BadgeRow>
      {(Object.keys(SESSION_STATUS_VARIANT) as SessionStatus[]).map((status) => (
        <StatusBadge key={status} kind="session" status={status} />
      ))}
      <VisibilityBadge visibility="private" />
      <VisibilityBadge visibility="public" />
    </BadgeRow>
  ),
};
