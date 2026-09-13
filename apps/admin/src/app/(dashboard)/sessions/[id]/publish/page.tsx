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

  const drafts = new Map<
    string,
    {
      id: string;
      title: string | null;
      body: string;
      postedAt?: string;
      postedUrl?: string;
    }
  >();
  await Promise.all(
    detail.games.map(async (game) => {
      const draft = await repos.posts.getByGame(game.id);
      if (draft) {
        drafts.set(game.id, {
          id: draft.id,
          title: draft.title,
          body: draft.body,
          postedAt: draft.postedAt,
          postedUrl: draft.postedUrl,
        });
      }
    }),
  );

  const games = toReviewPublishGames(detail.games, jobs, assets, drafts);
  const facebookGroupUrl = getState().settings.facebookGroupUrl.trim();

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium">Review & Publish</h2>
        <p className="text-sm text-muted-foreground">
          Check provider assets and Facebook drafts, then publish a game or the whole session.
          Publishing a session does not publish games unless “Also publish all games” is checked. A
          missing YouTube or Drive file warns first; confirm still publishes. Admin and the public
          site do not share memory — mock writes go to packages/mocks/.data/store.json.
        </p>
      </div>
      <SessionReviewPublish
        sessionId={detail.session.id}
        sessionStatus={detail.session.status}
        sessionVisibility={detail.session.visibility}
        facebookGroupUrl={facebookGroupUrl || undefined}
        games={games}
      />
    </section>
  );
}
