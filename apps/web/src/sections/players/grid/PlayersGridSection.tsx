import type { Player, SessionListItem } from "@fe-template/mocks";
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

/** Players already limited to public-game appearances by `listPublicPlayers`. */
export function toPlayersGridCards(
  players: Player[],
  sessions: SessionListItem[],
): PlayerCardProps[] {
  return players
    .filter((player): player is Player & { slug: string } => Boolean(player.slug))
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
