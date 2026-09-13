import type { Player, SessionListItem } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { PlayerCard } from "@/sections/_shared/player-card/PlayerCard";
import type { PlayerCardProps } from "@/sections/_shared/player-card/PlayerCard.types";

import type { PlayersStripSectionProps } from "./PlayersStripSection.types";

function playerInitials(displayName: string): string {
  const parts = displayName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    return (parts[0]?.[0] ?? "?").toUpperCase();
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export function toPlayersStripCards(
  players: Player[],
  sessions: SessionListItem[],
): PlayerCardProps[] {
  const publicNames = new Set(sessions.flatMap((session) => session.playerNames));

  return players
    .filter((player) => Boolean(player.slug) && publicNames.has(player.displayName))
    .map((player) => ({
      href: ROUTES.player(player.slug as string),
      displayName: player.displayName,
      nickname: player.nickname ?? undefined,
      sessionCount: sessions.filter((session) => session.playerNames.includes(player.displayName))
        .length,
      initials: playerInitials(player.displayName),
      isArchived: player.isArchived,
    }));
}

function PlayersStripSection({ className, players }: PlayersStripSectionProps) {
  return (
    <section
      data-slot="players-strip-section"
      className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Players</h2>
        <Link
          href={ROUTES.players}
          className="inline-flex min-h-10 items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          All players
        </Link>
      </div>
      {players.length === 0 ? (
        <Empty className="mt-6 border">
          <EmptyHeader>
            <EmptyTitle>No public players</EmptyTitle>
            <EmptyDescription>
              Players appear here when they show up on a published session.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="mt-6 flex max-w-full list-none gap-4 overflow-x-auto p-0 pb-2">
          {players.map((player) => (
            <li key={player.href} className="min-w-56 shrink-0">
              <PlayerCard {...player} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export type { PlayersStripSectionProps };
export { PlayersStripSection };
