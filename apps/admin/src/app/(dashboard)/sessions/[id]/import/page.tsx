import { notFound } from "next/navigation";

import { getPlaymatesRepos } from "@/lib/playmates";
import { SessionImport } from "@/modules/playmates/session-import/SessionImport";

type SessionImportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionImportPage({ params }: SessionImportPageProps) {
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
        <h2 className="font-heading text-xl font-medium">Import</h2>
        <p className="text-sm text-muted-foreground">
          Capture local video metadata. Files stay in this browser tab until you upload.
        </p>
      </div>
      <SessionImport
        sessionId={detail.session.id}
        recordings={recordings.map((recording) => ({
          id: recording.id,
          originalFilename: recording.originalFilename,
          mimeType: recording.mimeType,
          sizeBytes: recording.sizeBytes,
          localLastModifiedAt: recording.localLastModifiedAt,
          gameId: recording.gameId,
          cameraSide: recording.cameraSide,
        }))}
        games={games.map((game) => ({
          id: game.id,
          gameNumber: game.gameNumber,
        }))}
      />
    </section>
  );
}
