import { notFound } from "next/navigation";

import { getPlaymatesRepos } from "@/lib/playmates";
import { SessionOrganize } from "@/modules/playmates/session-organize/SessionOrganize";

type SessionOrganizePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionOrganizePage({ params }: SessionOrganizePageProps) {
  const { id } = await params;
  const repos = getPlaymatesRepos();
  const detail = await repos.sessions.getById(id);
  if (!detail) notFound();

  const [recordings, games] = await Promise.all([
    repos.recordings.listBySession(id),
    repos.games.listBySession(id),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium">Organize</h2>
        <p className="text-sm text-muted-foreground">
          Drag a recording onto a Side A or Side B lane, or use Move to… on the card.
        </p>
      </div>
      <SessionOrganize
        sessionId={detail.session.id}
        recordings={recordings.map((recording) => ({
          id: recording.id,
          originalFilename: recording.originalFilename,
          displayName: recording.displayName,
          sizeBytes: recording.sizeBytes,
          durationSeconds: recording.durationSeconds,
          cameraSide: recording.cameraSide,
          partNumber: recording.partNumber,
          sortOrder: recording.sortOrder,
          gameId: recording.gameId,
        }))}
        games={games.map((game) => ({
          id: game.id,
          gameNumber: game.gameNumber,
          sortOrder: game.sortOrder,
        }))}
      />
    </section>
  );
}
