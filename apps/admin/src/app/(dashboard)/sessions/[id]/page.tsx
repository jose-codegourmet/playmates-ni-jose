import { formatSessionDisplayDate } from "@fe-template/mocks";
import { notFound } from "next/navigation";

import { getPlaymatesRepos } from "@/lib/playmates";

type SessionWorkspaceStubPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionWorkspaceStubPage({ params }: SessionWorkspaceStubPageProps) {
  const { id } = await params;
  const repos = getPlaymatesRepos();
  const detail = await repos.sessions.getById(id);
  if (!detail) notFound();

  return (
    <div className="space-y-2">
      <h1 className="font-display text-3xl tracking-tight">
        {formatSessionDisplayDate(detail.session.sessionDate)}
      </h1>
      <p className="text-muted-foreground">Workspace incoming</p>
    </div>
  );
}
