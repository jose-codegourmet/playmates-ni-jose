import { getPlaymatesRepos } from "@/lib/playmates";

import { SessionsTable } from "./sessions-table/SessionsTable";
import type { SessionRow } from "./sessions-table/SessionsTable.types";

async function loadSessionRows(): Promise<SessionRow[]> {
  const repos = getPlaymatesRepos();
  const listed = await repos.sessions.list();

  const rows: SessionRow[] = [];
  for (const item of listed) {
    if (!item.slug) continue;
    const detail = await repos.sessions.getBySlug(item.slug);
    if (!detail) continue;

    rows.push({
      id: detail.session.id,
      date: item.date,
      title: item.title,
      venueName: item.venueName,
      status: item.status,
      visibility: item.visibility,
      gameCount: item.gameCount,
    });
  }

  return rows;
}

export default async function SessionsPage() {
  const sessions = await loadSessionRows();
  return <SessionsTable sessions={sessions} />;
}
