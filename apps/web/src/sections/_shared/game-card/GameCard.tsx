import {
  Badge,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fe-template/ui";
import Link from "next/link";

import type { GameCardProps } from "./GameCard.types";

function isPublicHref(href: string | undefined): href is string {
  if (href === undefined) {
    return false;
  }

  const trimmed = href.trim();
  return trimmed.length > 0 && trimmed !== "#";
}

function GameCard({
  href,
  gameNumber,
  matchupLabel,
  recordingCount,
  youtubeHref,
  driveHref,
}: GameCardProps) {
  const youtubeUrl = isPublicHref(youtubeHref) ? youtubeHref.trim() : null;
  const driveUrl = isPublicHref(driveHref) ? driveHref.trim() : null;

  return (
    <Card size="sm" className="max-w-sm">
      <Link
        href={href}
        className="nb-card-link focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Game ${gameNumber}, ${matchupLabel}, ${recordingCount} videos`}
      >
        <CardHeader>
          <CardTitle>Game {gameNumber}</CardTitle>
          <CardDescription>{matchupLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">{recordingCount} videos</Badge>
        </CardContent>
      </Link>
      {youtubeUrl || driveUrl ? (
        <CardContent className="flex flex-wrap gap-2 pt-0">
          {youtubeUrl ? (
            <a
              className={buttonVariants({ variant: "outline", size: "sm" })}
              href={youtubeUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              YouTube
            </a>
          ) : null}
          {driveUrl ? (
            <a
              className={buttonVariants({ variant: "outline", size: "sm" })}
              href={driveUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Drive
            </a>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
}

export type { GameCardProps };
export { GameCard };
