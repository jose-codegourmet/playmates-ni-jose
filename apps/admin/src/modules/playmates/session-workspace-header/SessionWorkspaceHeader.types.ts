import type { SessionStatus, Visibility } from "@fe-template/mocks";

export type SessionWorkspaceSaveState = "saved" | "saving" | "error";

export type SessionWorkspaceHeaderProps = {
  date: string;
  title: string;
  venueName: string;
  status: SessionStatus;
  visibility: Visibility;
  saveState: SessionWorkspaceSaveState;
};
