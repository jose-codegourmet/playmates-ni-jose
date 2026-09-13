import { getState } from "@fe-template/mocks";
import { notFound } from "next/navigation";

import { getPlaymatesRepos } from "@/lib/playmates";
import { toReviewPublishGames } from "@/modules/playmates/session-review-publish/map-publish";
import { SessionReviewPublish } from "@/modules/playmates/session-review-publish/SessionReviewPublish";

type SessionPublishPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionPublishPage({ params }: SessionPublishPageProps) {
  const { id } = await params;
  const repos = getPlaymatesRepos();
  const detail = await repos.sessions.getById(id);
  if (!detail) notFound();

  const [recordings, jobs] = await Promise.all([
    repos.recordings.listBySession(id),
    repos.uploads.listBySession(id),
  ]);

  const recordingIds = new Set(recordings.map((recording) => recording.id));
  const assets = getState()
    .providerAssets.filter((asset) => recordingIds.has(asset.recordingId))
    .map((asset) => ({
      recordingId: asset.recordingId,
      provider: asset.provider,
    }));

  const drafts = new Map<string, { title: string | null; body: string }>();
  await Promise.all(
    detail.games.map(async (game) => {
      const draft = await repos.posts.getByGame(game.id);
      if (draft) {
        drafts.set(game.id, { title: draft.title, body: draft.body });
      }
    }),
  );

  const games = toReviewPublishGames(detail.games, jobs, assets, drafts);

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium">Review & Publish</h2>
        <p className="text-sm text-muted-foreground">
          Check provider assets and Facebook drafts, then publish a game or the whole session. A
          missing YouTube or Drive file is a warning, not a blocker.
        </p>
      </div>
      <SessionReviewPublish
        sessionId={detail.session.id}
        sessionStatus={detail.session.status}
        sessionVisibility={detail.session.visibility}
        games={games}
      />
    </section>
  );
}
