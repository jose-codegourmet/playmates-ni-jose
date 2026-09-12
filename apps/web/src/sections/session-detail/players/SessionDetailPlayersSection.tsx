import type { Player } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { PlayerCard } from "@/sections/_shared/player-card/PlayerCard";
import type { PlayerCardProps } from "@/sections/_shared/player-card/PlayerCard.types";

import type { SessionDetailPlayersSectionProps } from "./SessionDetailPlayersSection.types";

function playerInitials(displayName: string): string {
  const parts = displayName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    return (parts[0]?.[0] ?? "?").toUpperCase();
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export function toSessionDetailPlayerCards(players: Player[]): PlayerCardProps[] {
  return players
    .filter((player): player is Player & { slug: string } => Boolean(player.slug))
    .map((player) => ({
      href: ROUTES.player(player.slug),
      displayName: player.displayName,
      nickname: player.nickname ?? undefined,
      initials: playerInitials(player.displayName),
      isArchived: player.isArchived,
    }));
}

function SessionDetailPlayersSection({ className, players }: SessionDetailPlayersSectionProps) {
  return (
    <section
      data-slot="session-detail-players-section"
      className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight">Players</h2>
      {players.length === 0 ? (
        <Empty className="mt-6 border">
          <EmptyHeader>
            <EmptyTitle>No public players</EmptyTitle>
            <EmptyDescription>Players from this session will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
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

export type { SessionDetailPlayersSectionProps };
export { SessionDetailPlayersSection };
