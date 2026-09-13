import { notFound } from "next/navigation";

import { getPlaymatesRepos } from "@/lib/playmates";

import { SessionDetailsForm } from "./details-form/SessionDetailsForm";

type SessionDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionDetailsPage({ params }: SessionDetailsPageProps) {
  const { id } = await params;
  const repos = getPlaymatesRepos();
  const detail = await repos.sessions.getById(id);
  if (!detail) notFound();

  const venues = await repos.venues.list();
  const courts = (
    await Promise.all(venues.map((venue) => repos.venues.listCourts(venue.id)))
  ).flat();

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium">Details</h2>
        <p className="text-sm text-muted-foreground">
          Update session metadata. Roster lives on the Players step.
        </p>
      </div>
      <SessionDetailsForm
        sessionId={detail.session.id}
        slug={detail.session.slug}
        venues={venues.map((venue) => ({ id: venue.id, name: venue.name }))}
        courts={courts.map((court) => ({
          id: court.id,
          name: court.name,
          venueId: court.venueId,
        }))}
        defaultValues={{
          sessionDate: detail.session.sessionDate,
          title: detail.session.title ?? "",
          venueId: detail.session.venueId ?? "",
          courtId: detail.session.courtId ?? "",
          notes: detail.session.notes ?? "",
          visibility: detail.session.visibility,
          status: detail.session.status,
        }}
      />
    </section>
  );
}
