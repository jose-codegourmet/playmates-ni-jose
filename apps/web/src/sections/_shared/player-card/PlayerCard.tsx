import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from "@fe-template/ui";
import Link from "next/link";

import type { PlayerCardProps } from "./PlayerCard.types";

function PlayerCard({
  href,
  displayName,
  nickname,
  sessionCount,
  initials,
  isArchived = false,
}: PlayerCardProps) {
  const nicknameLabel = nickname?.trim() || null;
  const ariaParts = [
    displayName,
    nicknameLabel ? `nickname ${nicknameLabel}` : null,
    sessionCount === undefined ? null : `${sessionCount} sessions`,
    isArchived ? "archived" : null,
  ];

  return (
    <Link
      href={href}
      className="block max-w-sm rounded-xl text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={ariaParts.filter(Boolean).join(", ")}
    >
      <Card
        size="sm"
        className={cn(
          "h-full transition-colors hover:bg-muted/40",
          isArchived && "bg-muted/30 text-muted-foreground opacity-70 hover:bg-muted/30",
        )}
      >
        <CardHeader className="grid-cols-[auto_1fr] items-center gap-3">
          <Avatar size="lg" className={cn(isArchived && "opacity-80")}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className={cn(isArchived && "text-muted-foreground")}>
              {displayName}
            </CardTitle>
            {nicknameLabel ? <CardDescription>{nicknameLabel}</CardDescription> : null}
          </div>
        </CardHeader>
        {sessionCount !== undefined || isArchived ? (
          <CardContent className="flex flex-wrap items-center gap-2">
            {sessionCount !== undefined ? (
              <Badge variant="secondary">{sessionCount} sessions</Badge>
            ) : null}
            {isArchived ? <Badge variant="outline">Archived</Badge> : null}
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}

export type { PlayerCardProps };
export { PlayerCard };
