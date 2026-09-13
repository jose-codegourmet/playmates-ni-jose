import { applyUploadSimulation, getState } from "@fe-template/mocks";
import { notFound } from "next/navigation";

import { getPlaymatesRepos } from "@/lib/playmates";
import { SessionUpload } from "@/modules/playmates/session-upload/SessionUpload";

type SessionUploadPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionUploadPage({ params }: SessionUploadPageProps) {
  const { id } = await params;
  applyUploadSimulation();
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
      url: asset.url,
    }));

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium">Upload</h2>
        <p className="text-sm text-muted-foreground">
          Queue Drive and YouTube jobs from this browser. Source files stay in the tab until you
          reselect them after a refresh. File bytes are never sent from this step.
        </p>
      </div>
      <SessionUpload
        sessionId={detail.session.id}
        recordings={recordings.map((recording) => ({
          id: recording.id,
          originalFilename: recording.originalFilename,
          displayName: recording.displayName,
          sizeBytes: recording.sizeBytes,
        }))}
        jobs={jobs.map((job) => ({
          id: job.id,
          recordingId: job.recordingId,
          provider: job.provider,
          status: job.status,
          progressPercent: job.progressPercent,
          lastErrorMessage: job.lastErrorMessage,
          updatedAt: job.updatedAt,
        }))}
        assets={assets}
      />
    </section>
  );
}
