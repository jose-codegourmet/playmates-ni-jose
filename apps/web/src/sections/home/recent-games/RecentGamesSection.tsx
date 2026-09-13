import { formatGameSlug, formatMatchup } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import { ROUTES } from "@/constants/routes";
import type { PublicListedGame } from "@/lib/playmates";
import { cn } from "@/lib/utils";
import { GameCard } from "@/sections/_shared/game-card/GameCard";
import type { GameCardProps } from "@/sections/_shared/game-card/GameCard.types";

import type { RecentGamesSectionProps } from "./RecentGamesSection.types";

const RECENT_LIMIT = 6;

export function toRecentGameCards(games: PublicListedGame[]): GameCardProps[] {
  return games
    .filter((game): game is PublicListedGame & { gameNumber: number } => game.gameNumber != null)
    .map((game) => {
      const team1 =
        game.teams.find((team) => team.teamNo === 1)?.players.map((player) => player.displayName) ??
        [];
      const team2 =
        game.teams.find((team) => team.teamNo === 2)?.players.map((player) => player.displayName) ??
        [];
      return {
        href: ROUTES.game(formatGameSlug(game.sessionDate, game.gameNumber)),
        gameNumber: game.gameNumber,
        matchupLabel: formatMatchup(team1, team2),
        recordingCount: game.recordings.length,
      };
    })
    .slice(0, RECENT_LIMIT);
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
