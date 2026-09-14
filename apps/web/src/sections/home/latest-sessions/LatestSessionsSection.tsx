import type { SessionListItem } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SessionCard } from "@/sections/_shared/session-card/SessionCard";
import type { SessionCardProps } from "@/sections/_shared/session-card/SessionCard.types";

import type { LatestSessionsSectionProps } from "./LatestSessionsSection.types";

const LATEST_LIMIT = 3;

export function toLatestSessionCards(sessions: SessionListItem[]): SessionCardProps[] {
  return [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((session): session is SessionListItem & { slug: string } => Boolean(session.slug))
    .slice(0, LATEST_LIMIT)
    .map((session) => ({
      href: ROUTES.session(session.slug),
      sessionDate: session.date,
      title: session.title ?? undefined,
      venueName: session.venueName ?? undefined,
      gameCount: session.gameCount,
      playerNames: session.playerNames,
    }));
}

function LatestSessionsSection({ className, sessions }: LatestSessionsSectionProps) {
  return (
    <section
      data-slot="latest-sessions-section"
      className={cn("px-4 py-12 sm:px-6 lg:px-8", className)}
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-4xl tracking-tight">Latest sessions</h2>
        {sessions.length === 0 ? (
          <Empty className="nb-box-sm mt-6">
            <EmptyHeader>
              <Image
                src="/images/mascot/shrug.png"
                alt=""
                width={160}
                height={160}
                className="mx-auto mb-3"
              />
              <EmptyTitle>No published sessions</EmptyTitle>
              <EmptyDescription>
                Public sessions will show up here when they are ready.
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
      </div>
    </section>
  );
}

export type { LatestSessionsSectionProps };
export { LatestSessionsSection };
