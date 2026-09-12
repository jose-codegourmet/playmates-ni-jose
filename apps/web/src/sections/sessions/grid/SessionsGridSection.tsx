import type { SessionListItem } from "@fe-template/mocks";
import { Empty, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SessionCard } from "@/sections/_shared/session-card/SessionCard";
import type { SessionCardProps } from "@/sections/_shared/session-card/SessionCard.types";

import type { SessionsGridSectionProps } from "./SessionsGridSection.types";

export function toSessionCards(sessions: SessionListItem[]): SessionCardProps[] {
  return [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((session): session is SessionListItem & { slug: string } => Boolean(session.slug))
    .map((session) => ({
      href: ROUTES.session(session.slug),
      sessionDate: session.date,
      title: session.title ?? undefined,
      venueName: session.venueName ?? undefined,
      gameCount: session.gameCount,
      playerNames: session.playerNames,
    }));
}

function SessionsGridSection({ className, sessions }: SessionsGridSectionProps) {
  return (
    <section
      data-slot="sessions-grid-section"
      className={cn("mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8", className)}
    >
      {sessions.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No published sessions match</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
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

export type { SessionsGridSectionProps };
export { SessionsGridSection };
