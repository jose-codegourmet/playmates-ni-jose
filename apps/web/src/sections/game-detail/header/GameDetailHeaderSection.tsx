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
      className={cn("mx-auto max-w-7xl px-4 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-8", className)}
    >
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Game {gameNumber}
      </h1>
      <div className="mt-3 text-lg md:text-xl">
        <MatchupLabel team1={team1} team2={team2} />
      </div>
      <p className="mt-4 text-base text-muted-foreground md:text-lg">
        <time dateTime={sessionDate}>{displayDate}</time>
        {venue ? ` · ${venue}` : null}
      </p>
      <p className="mt-3">
        <Link
          href={sessionHref}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Back to {sessionName}
        </Link>
      </p>
    </section>
  );
}

export type { GameDetailHeaderSectionProps };
export { GameDetailHeaderSection };
