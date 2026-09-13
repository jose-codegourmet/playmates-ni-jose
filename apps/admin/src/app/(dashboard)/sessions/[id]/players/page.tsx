import { notFound } from "next/navigation";

import { getPlaymatesRepos } from "@/lib/playmates";
import { SessionRosterEditor } from "@/modules/playmates/session-roster-editor/SessionRosterEditor";

type SessionPlayersPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionPlayersPage({ params }: SessionPlayersPageProps) {
  const { id } = await params;
  const repos = getPlaymatesRepos();
  const detail = await repos.sessions.getById(id);
  if (!detail) notFound();

  const activePlayers = await repos.players.list();
  const rosterIds = new Set(detail.players.map((player) => player.id));
  const selectedPlayerIds = activePlayers
    .filter((player) => rosterIds.has(player.id))
    .map((player) => player.id);
  const preservedPlayerIds = detail.players
    .filter((player) => player.isArchived)
    .map((player) => player.id);

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium">Players</h2>
        <p className="text-sm text-muted-foreground">Choose who played this session.</p>
      </div>
      <SessionRosterEditor
        sessionId={detail.session.id}
        players={activePlayers.map((player) => ({
          id: player.id,
          displayName: player.displayName,
        }))}
        selectedPlayerIds={selectedPlayerIds}
        preservedPlayerIds={preservedPlayerIds}
      />
    </section>
  );
}
