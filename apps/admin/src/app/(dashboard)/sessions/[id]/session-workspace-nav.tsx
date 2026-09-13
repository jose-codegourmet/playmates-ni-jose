"use client";

import { usePathname } from "next/navigation";

import {
  SESSION_WORKSPACE_STEP_IDS,
  SessionWorkspaceStepper,
  type StepId,
} from "@/modules/playmates/session-workspace-stepper/SessionWorkspaceStepper";

const STEP_PATH: Record<StepId, string> = {
  details: "details",
  players: "players",
  import: "import",
  organize: "organize",
  matchups: "matchups",
  upload: "upload",
  review: "publish",
};

function stepFromPathname(pathname: string): StepId {
  const segment = pathname.split("/").filter(Boolean).at(-1);
  if (segment === "publish") return "review";
  if (segment && (SESSION_WORKSPACE_STEP_IDS as readonly string[]).includes(segment)) {
    return segment as StepId;
  }
  return "details";
}

type SessionWorkspaceNavProps = {
  sessionId: string;
};

function SessionWorkspaceNav({ sessionId }: SessionWorkspaceNavProps) {
  const pathname = usePathname();
  const current = stepFromPathname(pathname);

  return (
    <SessionWorkspaceStepper
      current={current}
      completed={[]}
      hrefFor={(step) => `/sessions/${sessionId}/${STEP_PATH[step]}`}
    />
  );
}

export { SessionWorkspaceNav };
