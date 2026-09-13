"use client";

import { formatSessionDisplayDate } from "@fe-template/mocks";
import { Badge } from "@fe-template/ui";

import { StatusBadge, VisibilityBadge } from "../status-badge/StatusBadge";
import type {
  SessionWorkspaceHeaderProps,
  SessionWorkspaceSaveState,
} from "./SessionWorkspaceHeader.types";
import { useOptionalSessionWorkspaceSave } from "./SessionWorkspaceSaveContext";

const SAVE_STATE_LABEL = {
  saved: "Saved",
  saving: "Saving",
  error: "Save failed",
} as const satisfies Record<SessionWorkspaceSaveState, string>;

const SAVE_STATE_VARIANT = {
  saved: "outline",
  saving: "secondary",
  error: "destructive",
} as const satisfies Record<
  SessionWorkspaceSaveState,
  "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
>;

function untitledTitle(title: string): boolean {
  return title.trim().length === 0;
}

function SessionWorkspaceHeader({
  date,
  title,
  venueName,
  status,
  visibility,
  saveState: saveStateProp,
}: SessionWorkspaceHeaderProps) {
  const saveContext = useOptionalSessionWorkspaceSave();
  const saveState = saveContext?.saveState ?? saveStateProp;
  const displayDate = formatSessionDisplayDate(date);
  const heading = untitledTitle(title) ? "Untitled session" : title.trim();

  return (
    <header
      data-slot="session-workspace-header"
      className="flex w-full min-w-0 flex-col gap-3 overflow-x-clip bg-background text-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
    >
      <time className="shrink-0 text-sm text-muted-foreground" dateTime={date}>
        {displayDate}
      </time>
      <h1
        className={
          untitledTitle(title)
            ? "min-w-0 truncate font-heading text-base font-medium leading-snug text-muted-foreground"
            : "min-w-0 truncate font-heading text-base font-medium leading-snug"
        }
      >
        {heading}
      </h1>
      <p className="min-w-0 truncate text-sm text-muted-foreground">{venueName}</p>
      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:ml-auto sm:justify-end">
        <StatusBadge kind="session" status={status} />
        <VisibilityBadge visibility={visibility} />
        <Badge variant={SAVE_STATE_VARIANT[saveState]} aria-live="polite">
          {SAVE_STATE_LABEL[saveState]}
        </Badge>
      </div>
    </header>
  );
}

export type { SessionWorkspaceHeaderProps, SessionWorkspaceSaveState };
export { SessionWorkspaceHeader };
