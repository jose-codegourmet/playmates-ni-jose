import type { GameWithTeamsAndRecordings, SessionListItem } from "@fe-template/mocks";
import { formatGameSlug, formatMatchup } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { GameCard } from "@/sections/_shared/game-card/GameCard";
import type { GameCardProps } from "@/sections/_shared/game-card/GameCard.types";

import type { RecentGamesSectionProps } from "./RecentGamesSection.types";

const RECENT_LIMIT = 6;

export function toRecentGameCards(
  sessions: SessionListItem[],
  games: GameWithTeamsAndRecordings[],
): GameCardProps[] {
  const sortedSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  const cards: GameCardProps[] = [];
  let offset = 0;

  for (const session of sortedSessions) {
    const slice = games.slice(offset, offset + session.gameCount);
    offset += session.gameCount;

    for (const game of slice) {
      if (game.gameNumber == null) continue;
      const team1 =
        game.teams.find((team) => team.teamNo === 1)?.players.map((player) => player.displayName) ??
        [];
      const team2 =
        game.teams.find((team) => team.teamNo === 2)?.players.map((player) => player.displayName) ??
        [];
      cards.push({
        href: ROUTES.game(formatGameSlug(session.date, game.gameNumber)),
        gameNumber: game.gameNumber,
        matchupLabel: formatMatchup(team1, team2),
        recordingCount: game.recordings.length,
      });
    }
  }

  return cards.slice(0, RECENT_LIMIT);
}

function RecentGamesSection({ className, games }: RecentGamesSectionProps) {
  return (
    <section
      data-slot="recent-games-section"
      className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", className)}
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight">Recent games</h2>
      {games.length === 0 ? (
        <Empty className="mt-6 border">
          <EmptyHeader>
            <EmptyTitle>No published games</EmptyTitle>
            <EmptyDescription>
              Public games from published sessions will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <li key={game.href} className="min-w-0">
              <GameCard {...game} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export type { RecentGamesSectionProps };
export { RecentGamesSection };
