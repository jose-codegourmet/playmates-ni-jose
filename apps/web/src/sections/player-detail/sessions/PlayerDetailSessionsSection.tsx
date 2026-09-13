import type { SessionListItem } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SessionCard } from "@/sections/_shared/session-card/SessionCard";
import type { SessionCardProps } from "@/sections/_shared/session-card/SessionCard.types";

import type { PlayerDetailSessionsSectionProps } from "./PlayerDetailSessionsSection.types";

const RECENT_LIMIT = 6;

/** Cards for public sessions already filtered to this player's public games. */
export function toPlayerDetailSessionCards(sessions: SessionListItem[]): SessionCardProps[] {
  return [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((session): session is SessionListItem & { slug: string } => Boolean(session.slug))
    .slice(0, RECENT_LIMIT)
    .map((session) => ({
      href: ROUTES.session(session.slug),
      sessionDate: session.date,
      title: session.title ?? undefined,
      venueName: session.venueName ?? undefined,
      gameCount: session.gameCount,
      playerNames: session.playerNames,
    }));
}

function PlayerDetailSessionsSection({ className, sessions }: PlayerDetailSessionsSectionProps) {
  return (
    <section
      data-slot="player-detail-sessions-section"
      className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight">Recent sessions</h2>
      {sessions.length === 0 ? (
        <Empty className="mt-6 border">
          <EmptyHeader>
            <EmptyTitle>No published sessions</EmptyTitle>
            <EmptyDescription>
              Public sessions this player appeared in will show up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <li key={session.href} className="min-w-0">
              <SessionCard {...session} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export type { PlayerDetailSessionsSectionProps };
export { PlayerDetailSessionsSection };
