import { getPlaymatesRepos } from "@/lib/playmates";
import { SessionForm } from "@/modules/playmates/session-form/SessionForm";

export default async function NewSessionPage() {
  const repos = getPlaymatesRepos();
  const [venues, players] = await Promise.all([repos.venues.list(), repos.players.list()]);
  const courts = (
    await Promise.all(venues.map((venue) => repos.venues.listCourts(venue.id)))
  ).flat();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight">New session</h1>
        <p className="text-sm text-muted-foreground">
          Create a draft session. Roster can stay empty until you assign games.
        </p>
      </div>
      <SessionForm
        venues={venues.map((venue) => ({ id: venue.id, name: venue.name }))}
        courts={courts.map((court) => ({
          id: court.id,
          name: court.name,
          venueId: court.venueId,
        }))}
        players={players.map((player) => ({
          id: player.id,
          displayName: player.displayName,
        }))}
      />
    </div>
  );
}
