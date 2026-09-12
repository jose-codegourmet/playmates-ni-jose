import { formatSessionDisplayDate } from "@fe-template/mocks";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fe-template/ui";
import Image from "next/image";
import Link from "next/link";

import type { SessionCardProps } from "./SessionCard.types";

const VISIBLE_PLAYER_LIMIT = 5;

function formatPlayerSummary(playerNames: string[]): string | null {
  if (playerNames.length === 0) {
    return null;
  }

  if (playerNames.length <= VISIBLE_PLAYER_LIMIT) {
    return playerNames.join(", ");
  }

  const visible = playerNames.slice(0, VISIBLE_PLAYER_LIMIT);
  const overflow = playerNames.length - VISIBLE_PLAYER_LIMIT;
  return `${visible.join(", ")} +${overflow}`;
}

function SessionCard({
  href,
  sessionDate,
  title,
  venueName,
  gameCount,
  playerNames,
  thumbnailUrl,
}: SessionCardProps) {
  const displayDate = formatSessionDisplayDate(sessionDate);
  const playerSummary = formatPlayerSummary(playerNames);
  const heading = title ?? displayDate;

  return (
    <Link
      href={href}
      className="block max-w-sm rounded-xl text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={[displayDate, title, venueName, `${gameCount} games`].filter(Boolean).join(", ")}
    >
      <Card size="sm" className="h-full transition-colors hover:bg-muted/40">
        {thumbnailUrl ? (
          <div className="relative aspect-video w-full bg-muted">
            <Image
              src={thumbnailUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-cover"
            />
          </div>
        ) : null}
        <CardHeader>
          <CardTitle>{heading}</CardTitle>
          {title ? <CardDescription>{displayDate}</CardDescription> : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {venueName ? <p className="text-muted-foreground">{venueName}</p> : null}
          <Badge variant="secondary">{gameCount} games</Badge>
          {playerSummary ? <p className="text-muted-foreground">{playerSummary}</p> : null}
        </CardContent>
      </Card>
    </Link>
  );
}

export type { SessionCardProps };
export { SessionCard };
