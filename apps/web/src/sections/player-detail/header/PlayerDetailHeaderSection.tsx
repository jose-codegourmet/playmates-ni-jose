import { Avatar, AvatarFallback } from "@fe-template/ui";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

import type { PlayerDetailHeaderSectionProps } from "./PlayerDetailHeaderSection.types";

function playerInitials(displayName: string): string {
  const parts = displayName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    return (parts[0]?.[0] ?? "?").toUpperCase();
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

function PlayerDetailHeaderSection({
  className,
  displayName,
  nickname,
}: PlayerDetailHeaderSectionProps) {
  const nicknameLabel = nickname?.trim() || null;

  return (
    <section
      data-slot="player-detail-header-section"
      className={cn("nb-band bg-accent-sky px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8", className)}
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold tracking-wide text-ink uppercase">Player</p>
        <div className="mt-4 flex items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback>{playerInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="font-display text-5xl tracking-tight md:text-6xl">{displayName}</h1>
            {nicknameLabel ? (
              <p className="mt-2 text-base text-ink md:text-lg">{nicknameLabel}</p>
            ) : null}
          </div>
        </div>
        <p className="mt-6">
          <Link
            href={ROUTES.players}
            className="text-sm font-bold uppercase tracking-wide text-ink underline-offset-4 hover:underline"
          >
            All players
          </Link>
        </p>
      </div>
    </section>
  );
}

export type { PlayerDetailHeaderSectionProps };
export { PlayerDetailHeaderSection };
