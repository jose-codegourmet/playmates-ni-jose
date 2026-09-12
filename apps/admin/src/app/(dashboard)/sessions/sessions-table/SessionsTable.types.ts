import type { SessionStatus, Visibility } from "@fe-template/mocks";

export type SessionRow = {
  id: string;
  date: string;
  title: string | null;
  venueName: string | null;
  status: SessionStatus;
  visibility: Visibility;
  gameCount: number;
};

export type SessionStatusFilter = "all" | "draft" | "published";

export type SessionsTableProps = {
  sessions: SessionRow[];
};
