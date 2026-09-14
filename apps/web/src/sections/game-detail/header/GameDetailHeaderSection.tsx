import { formatSessionDisplayDate } from "@fe-template/mocks";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MatchupLabel } from "@/sections/_shared/matchup-label/MatchupLabel";

import type { GameDetailHeaderSectionProps } from "./GameDetailHeaderSection.types";

function GameDetailHeaderSection({
  className,
  gameNumber,
  team1,
  team2,
  sessionDate,
  sessionHref,
  sessionTitle,
  venueName,
}: GameDetailHeaderSectionProps) {
  const displayDate = formatSessionDisplayDate(sessionDate);
  const venue = venueName?.trim() || null;
  const sessionName = sessionTitle?.trim() || displayDate;

  return (
    <section
      data-slot="game-detail-header-section"
      className={cn("nb-band bg-accent-guava px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8", className)}
    >
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-5xl tracking-tight text-ink md:text-6xl">
          Game {gameNumber}
        </h1>
        <div className="mt-3 text-lg text-ink md:text-xl">
          <MatchupLabel team1={team1} team2={team2} />
        </div>
        <p className="mt-4 text-base text-ink md:text-lg">
          <time dateTime={sessionDate}>{displayDate}</time>
          {venue ? ` · ${venue}` : null}
        </p>
        <p className="mt-3">
          <Link
            href={sessionHref}
            className="inline-flex min-h-10 items-center text-sm font-bold uppercase tracking-wide text-ink underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Back to {sessionName}
          </Link>
        </p>
      </div>
    </section>
  );
}

export type { GameDetailHeaderSectionProps };
export { GameDetailHeaderSection };
