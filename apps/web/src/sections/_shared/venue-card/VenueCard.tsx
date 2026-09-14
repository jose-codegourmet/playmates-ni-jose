import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fe-template/ui";
import Link from "next/link";

import type { VenueCardProps } from "./VenueCard.types";

function formatSessionCount(sessionCount: number): string {
  return sessionCount === 1 ? "1 session" : `${sessionCount} sessions`;
}

function VenueCard({ href, name, address, sessionCount }: VenueCardProps) {
  const addressLabel = address?.trim() || null;
  const sessionLabel = formatSessionCount(sessionCount);

  return (
    <Link
      href={href}
      className="nb-card-link max-w-64 focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={[name, addressLabel, sessionLabel].filter(Boolean).join(", ")}
    >
      <Card size="sm" className="h-full">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          {addressLabel ? <CardDescription>{addressLabel}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">{sessionLabel}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

export type { VenueCardProps };
export { VenueCard };
