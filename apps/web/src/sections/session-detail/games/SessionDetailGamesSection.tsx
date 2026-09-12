import type { GameWithTeamsAndRecordings } from "@fe-template/mocks";
import { formatGameSlug, formatMatchup } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { GameCard } from "@/sections/_shared/game-card/GameCard";
import type { GameCardProps } from "@/sections/_shared/game-card/GameCard.types";

import type { SessionDetailGamesSectionProps } from "./SessionDetailGamesSection.types";

function teamNames(game: GameWithTeamsAndRecordings, teamNo: number): string[] {
  return (
    game.teams
      .find((team) => team.teamNo === teamNo)
      ?.players.map((player) => player.displayName) ?? []
  );
}

export function toSessionDetailGameCards(
  sessionDate: string,
  games: GameWithTeamsAndRecordings[],
): GameCardProps[] {
  return [...games]
    .sort((a, b) => {
      const sort = a.sortOrder - b.sortOrder;
      if (sort !== 0) return sort;
      return (a.gameNumber ?? 0) - (b.gameNumber ?? 0);
    })
    .filter((game): game is GameWithTeamsAndRecordings & { gameNumber: number } =>
      Boolean(game.gameNumber),
    )
    .map((game) => ({
      href: ROUTES.game(formatGameSlug(sessionDate, game.gameNumber)),
      gameNumber: game.gameNumber,
      matchupLabel: formatMatchup(teamNames(game, 1), teamNames(game, 2)),
      recordingCount: game.recordings.length,
    }));
}

function SessionDetailGamesSection({ className, games }: SessionDetailGamesSectionProps) {
  return (
    <section
      data-slot="session-detail-games-section"
      className={cn("mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-8", className)}
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight">Games</h2>
      {games.length === 0 ? (
        <Empty className="mt-6 border">
          <EmptyHeader>
            <EmptyTitle>No published games</EmptyTitle>
            <EmptyDescription>Public games from this session will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ol className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <li key={game.href} className="min-w-0">
              <GameCard {...game} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export type { SessionDetailGamesSectionProps };
export { SessionDetailGamesSection };
