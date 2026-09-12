import { formatSessionDisplayDate } from "@fe-template/mocks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@fe-template/ui";
import Link from "next/link";

import type { AwaitingFacebookProps } from "./AwaitingFacebook.types";

function gameLabel(gameNumber: number | null): string {
  return gameNumber == null ? "Game" : `Game ${gameNumber}`;
}

function AwaitingFacebook({ rows }: AwaitingFacebookProps) {
  return (
    <Card size="sm" data-slot="awaiting-facebook" className="gap-0 bg-background text-foreground">
      <CardHeader className="border-b border-border px-(--card-spacing) py-3">
        <CardTitle>Awaiting Facebook</CardTitle>
      </CardHeader>
      <CardContent className="px-(--card-spacing) py-3">
        {rows.length === 0 ? (
          <Empty className="min-h-0 p-4">
            <EmptyHeader>
              <EmptyTitle className="font-normal text-muted-foreground">
                No games awaiting Facebook
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((row) => (
              <li key={row.gameId} className="flex min-w-0 flex-col gap-0.5">
                <Link
                  href={`/sessions/${row.sessionId}`}
                  className="font-heading text-sm font-medium leading-snug text-primary underline-offset-4 hover:underline"
                >
                  {formatSessionDisplayDate(row.sessionDate)} · {gameLabel(row.gameNumber)}
                </Link>
                {row.title ? <p className="text-sm text-muted-foreground">{row.title}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export type { AwaitingFacebookProps };
export { AwaitingFacebook };
