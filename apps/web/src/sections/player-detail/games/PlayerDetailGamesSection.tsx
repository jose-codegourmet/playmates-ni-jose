import { formatGameSlug, formatMatchup } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import { ROUTES } from "@/constants/routes";
import type { PublicListedGame } from "@/lib/playmates";
import { cn } from "@/lib/utils";
import { GameCard } from "@/sections/_shared/game-card/GameCard";
import type { GameCardProps } from "@/sections/_shared/game-card/GameCard.types";

import type { PlayerDetailGamesSectionProps } from "./PlayerDetailGamesSection.types";

const RECENT_LIMIT = 6;

function teamNames(game: PublicListedGame, teamNo: number): string[] {
  return (
    game.teams
      .find((team) => team.teamNo === teamNo)
      ?.players.map((player) => player.displayName) ?? []
  );
}

/** Cards for public games already filtered to this player. */
export function toPlayerDetailGameCards(games: PublicListedGame[]): GameCardProps[] {
  return games
    .filter((game): game is PublicListedGame & { gameNumber: number } => game.gameNumber != null)
    .map((game) => ({
      href: ROUTES.game(formatGameSlug(game.sessionDate, game.gameNumber)),
      gameNumber: game.gameNumber,
      matchupLabel: formatMatchup(teamNames(game, 1), teamNames(game, 2)),
      recordingCount: game.recordings.length,
    }))
    .slice(0, RECENT_LIMIT);
}

function PlayerDetailGamesSection({ className, games }: PlayerDetailGamesSectionProps) {
  return (
    <section
      data-slot="player-detail-games-section"
      className={cn("mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-8", className)}
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight">Recent games</h2>
      {games.length === 0 ? (
        <Empty className="mt-6 border">
          <EmptyHeader>
            <EmptyTitle>No published games</EmptyTitle>
            <EmptyDescription>
              Public games this player appeared in will show up here.
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

export type { PlayerDetailGamesSectionProps };
export { PlayerDetailGamesSection };
