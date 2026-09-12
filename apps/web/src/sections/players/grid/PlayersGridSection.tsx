import type { GameWithTeamsAndRecordings, Player, SessionListItem } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { PlayerCard } from "@/sections/_shared/player-card/PlayerCard";
import type { PlayerCardProps } from "@/sections/_shared/player-card/PlayerCard.types";

import type { PlayersGridSectionProps } from "./PlayersGridSection.types";

function playerInitials(displayName: string): string {
  const parts = displayName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    return (parts[0]?.[0] ?? "?").toUpperCase();
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

function publicFacingPlayerNames(
  sessions: SessionListItem[],
  games: GameWithTeamsAndRecordings[],
): Set<string> {
  const names = new Set<string>();

  for (const session of sessions) {
    for (const name of session.playerNames) {
      names.add(name);
    }
  }

  for (const game of games) {
    for (const team of game.teams) {
      for (const player of team.players) {
        names.add(player.displayName);
      }
    }
  }

  return names;
}

/** Players who appear on at least one public session or public game. Draft-only players are omitted. */
export function toPlayersGridCards(
  players: Player[],
  sessions: SessionListItem[],
  games: GameWithTeamsAndRecordings[],
): PlayerCardProps[] {
  const publicNames = publicFacingPlayerNames(sessions, games);

  return players
    .filter(
      (player): player is Player & { slug: string } =>
        Boolean(player.slug) && publicNames.has(player.displayName),
    )
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .map((player) => ({
      href: ROUTES.player(player.slug),
      displayName: player.displayName,
      nickname: player.nickname ?? undefined,
      sessionCount: sessions.filter((session) => session.playerNames.includes(player.displayName))
        .length,
      initials: playerInitials(player.displayName),
      isArchived: player.isArchived,
    }));
}

function PlayersGridSection({ className, players }: PlayersGridSectionProps) {
  return (
    <section
      data-slot="players-grid-section"
      className={cn("mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8", className)}
    >
      {players.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No public players</EmptyTitle>
            <EmptyDescription>
              Players appear here when they show up on a published session or game.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <li key={player.href} className="min-w-0">
              <PlayerCard {...player} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export type { PlayersGridSectionProps };
export { PlayersGridSection };
