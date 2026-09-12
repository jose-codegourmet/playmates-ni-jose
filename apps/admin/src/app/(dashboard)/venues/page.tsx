import { getPlaymatesRepos } from "@/lib/playmates";

import { VenuesTable } from "./venues-table/VenuesTable";
import type { VenueRow } from "./venues-table/VenuesTable.types";

async function loadVenueRows(): Promise<VenueRow[]> {
  const repos = getPlaymatesRepos();
  const venues = await repos.venues.list({ includeArchived: true });

  return Promise.all(
    venues.map(async (venue) => {
      const courts = await repos.venues.listCourts(venue.id);
      return { ...venue, courtCount: courts.length };
    }),
  );
}

export default async function VenuesPage() {
  const venues = await loadVenueRows();
  return <VenuesTable venues={venues} />;
}
