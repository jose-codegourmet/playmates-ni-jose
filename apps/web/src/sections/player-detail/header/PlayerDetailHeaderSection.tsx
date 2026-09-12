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
      className={cn("mx-auto max-w-7xl px-4 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-8", className)}
    >
      <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Player</p>
      <div className="mt-4 flex items-center gap-4">
        <Avatar size="lg">
          <AvatarFallback>{playerInitials(displayName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {displayName}
          </h1>
          {nicknameLabel ? (
            <p className="mt-2 text-base text-muted-foreground md:text-lg">{nicknameLabel}</p>
          ) : null}
        </div>
      </div>
      <p className="mt-6">
        <Link
          href={ROUTES.players}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          All players
        </Link>
      </p>
    </section>
  );
}

export type { PlayerDetailHeaderSectionProps };
export { PlayerDetailHeaderSection };
