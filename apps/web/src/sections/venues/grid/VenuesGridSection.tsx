import type { SessionListItem, Venue } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { VenueCard } from "@/sections/_shared/venue-card/VenueCard";
import type { VenueCardProps } from "@/sections/_shared/venue-card/VenueCard.types";

import type { VenuesGridSectionProps } from "./VenuesGridSection.types";

/** Venues that have at least one public session. Draft-only venues are omitted. */
export function toVenueCards(venues: Venue[], sessions: SessionListItem[]): VenueCardProps[] {
  const publicSessionCounts = new Map<string, number>();

  for (const session of sessions) {
    const venueName = session.venueName?.trim();
    if (!venueName) continue;
    publicSessionCounts.set(venueName, (publicSessionCounts.get(venueName) ?? 0) + 1);
  }

  return venues
    .filter((venue): venue is Venue & { slug: string } => {
      if (!venue.slug) return false;
      return (publicSessionCounts.get(venue.name) ?? 0) > 0;
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((venue) => ({
      href: ROUTES.venue(venue.slug),
      name: venue.name,
      address: venue.address ?? undefined,
      sessionCount: publicSessionCounts.get(venue.name) ?? 0,
    }));
}

function VenuesGridSection({ className, venues }: VenuesGridSectionProps) {
  return (
    <section
      data-slot="venues-grid-section"
      className={cn("mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8", className)}
    >
      {venues.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No published venues</EmptyTitle>
            <EmptyDescription>
              Venues appear here when they host at least one published session.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <li key={venue.href} className="min-w-0">
              <VenueCard {...venue} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export type { VenuesGridSectionProps };
export { VenuesGridSection };
