"use client";

import type { UploadJobStatus } from "@fe-template/mocks";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@fe-template/ui";
import { TriangleAlertIcon } from "lucide-react";

import { StatusBadge, VisibilityBadge } from "../status-badge/StatusBadge";
import type {
  SessionPublishChecklistGame,
  SessionPublishChecklistProps,
} from "./SessionPublishChecklist.types";

function missingProviderLabels(game: SessionPublishChecklistGame): string[] {
  const missing: string[] = [];

  if (game.youtubeStatus == null) {
    missing.push("YouTube");
  }

  if (game.driveStatus == null) {
    missing.push("Google Drive");
  }

  return missing;
}

function missingProviderWarning(labels: string[]): string {
  if (labels.length === 1) {
    return `${labels[0]} is missing. You can still publish.`;
  }

  return `${labels.join(" and ")} are missing. You can still publish.`;
}

function ProviderState({ label, status }: { label: string; status: UploadJobStatus | null }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <p className="font-heading text-sm font-medium leading-snug">{label}</p>
      {status == null ? (
        <p className="text-sm text-muted-foreground">Missing</p>
      ) : (
        <StatusBadge kind="upload-job" status={status} />
      )}
    </div>
  );
}

function SessionPublishChecklist({
  games,
  onPublishGame,
  onUnpublishGame,
  onPublishAll,
}: SessionPublishChecklistProps) {
  return (
    <div
      data-slot="session-publish-checklist"
      className="flex w-full flex-col gap-4 bg-background text-foreground"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-base font-medium leading-snug">Publish checklist</h2>
        <Button type="button" size="sm" onClick={onPublishAll}>
          Publish all
        </Button>
      </div>

      {games.length === 0 ? (
        <Empty className="min-h-0 p-4">
          <EmptyHeader>
            <EmptyTitle className="font-normal text-muted-foreground">
              Nothing publishable yet.
            </EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="flex flex-col gap-3">
          {games.map((game) => {
            const missing = missingProviderLabels(game);

            return (
              <li key={game.id}>
                <Card size="sm" className="gap-0 bg-background text-foreground">
                  <CardHeader className="border-b border-border px-(--card-spacing) py-2">
                    <CardTitle>
                      Game {game.gameNumber}
                      <span className="mt-0.5 block font-normal text-muted-foreground">
                        {game.matchup}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 px-(--card-spacing) py-3">
                    <ProviderState label="YouTube" status={game.youtubeStatus} />
                    <ProviderState label="Google Drive" status={game.driveStatus} />
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <p className="font-heading text-sm font-medium leading-snug">Visibility</p>
                      <VisibilityBadge visibility={game.visibility} />
                    </div>
                    {missing.length > 0 ? (
                      <Alert>
                        <TriangleAlertIcon />
                        <AlertTitle>Provider missing</AlertTitle>
                        <AlertDescription>{missingProviderWarning(missing)}</AlertDescription>
                      </Alert>
                    ) : null}
                  </CardContent>
                  <CardFooter className="justify-end gap-2">
                    {game.visibility === "public" && onUnpublishGame ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onUnpublishGame(game.id)}
                      >
                        Unpublish game
                      </Button>
                    ) : null}
                    <Button type="button" size="sm" onClick={() => onPublishGame(game.id)}>
                      Publish game
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export type { SessionPublishChecklistGame, SessionPublishChecklistProps };
export { SessionPublishChecklist };
