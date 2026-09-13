import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getPlaymatesRepos } from "@/lib/playmates";
import { SessionWorkspaceHeader } from "@/modules/playmates/session-workspace-header/SessionWorkspaceHeader";
import { SessionWorkspaceSaveProvider } from "@/modules/playmates/session-workspace-header/SessionWorkspaceSaveContext";

import { SessionWorkspaceNav } from "./session-workspace-nav";

type SessionWorkspaceLayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export default async function SessionWorkspaceLayout({
  children,
  params,
}: SessionWorkspaceLayoutProps) {
  const { id } = await params;
  const detail = await getPlaymatesRepos().sessions.getById(id);
  if (!detail) notFound();

  return (
    <SessionWorkspaceSaveProvider>
      <div className="space-y-6">
        <SessionWorkspaceHeader
          date={detail.session.sessionDate}
          title={detail.session.title ?? ""}
          venueName={detail.venue?.name ?? ""}
          status={detail.session.status}
          visibility={detail.session.visibility}
          saveState="saved"
        />
        <SessionWorkspaceNav sessionId={id} />
        {children}
      </div>
    </SessionWorkspaceSaveProvider>
  );
}
