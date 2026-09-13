"use client";

import type { Visibility } from "@fe-template/mocks";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  NativeSelect,
  NativeSelectOption,
} from "@fe-template/ui";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  publishAllSessionGames,
  publishSessionGame,
  publishWorkspaceSession,
  setGamePublishVisibility,
  setSessionPublishVisibility,
  unpublishWorkspaceSession,
} from "@/app/(dashboard)/sessions/[id]/publish/actions";

import { FacebookPostPreview } from "../facebook-post-preview/FacebookPostPreview";
import { SessionPublishChecklist } from "../session-publish-checklist/SessionPublishChecklist";
import { useSessionWorkspaceSave } from "../session-workspace-header/SessionWorkspaceSaveContext";
import { StatusBadge, VisibilityBadge } from "../status-badge/StatusBadge";
import { toChecklistGames } from "./map-publish";
import type {
  SessionReviewPublishGame,
  SessionReviewPublishProps,
} from "./SessionReviewPublish.types";

type ActionResult = { success: boolean; error?: string };

function SessionReviewPublish({
  sessionId,
  sessionStatus,
  sessionVisibility,
  games,
  onPublishGame,
  onPublishAll,
  onPublishSession,
  onUnpublishSession,
  onSetSessionVisibility,
  onSetGameVisibility,
}: SessionReviewPublishProps) {
  const [localGames, setLocalGames] = useState(games);
  const [localVisibility, setLocalVisibility] = useState(sessionVisibility);
  const { beginSave, endSave } = useSessionWorkspaceSave();

  useEffect(() => {
    setLocalGames(games);
  }, [games]);

  useEffect(() => {
    setLocalVisibility(sessionVisibility);
  }, [sessionVisibility]);

  async function flickerSave(work: () => Promise<void>): Promise<void> {
    beginSave();
    try {
      await work();
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 280);
      });
      endSave(true);
    } catch {
      endSave(false);
    }
  }

  async function persistResult(action: () => Promise<ActionResult>): Promise<boolean> {
    beginSave();
    const result = await action();
    if (!result.success) {
      endSave(false);
      toast.error(result.error ?? "Could not update publish state.");
      return false;
    }
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 280);
    });
    endSave(true);
    return true;
  }

  async function handlePublishGame(gameId: string) {
    if (onPublishGame) {
      await flickerSave(async () => {
        await onPublishGame(gameId);
      });
      toast.success("Game published");
      return;
    }

    if (!sessionId) {
      toast.error("Missing session id for publish");
      return;
    }

    const ok = await persistResult(() => publishSessionGame(sessionId, gameId));
    if (ok) toast.success("Game published");
  }

  async function handlePublishAll() {
    if (onPublishAll) {
      await flickerSave(async () => {
        await onPublishAll();
      });
      toast.success("All games published");
      return;
    }

    if (!sessionId) {
      toast.error("Missing session id for publish");
      return;
    }

    const ok = await persistResult(() => publishAllSessionGames(sessionId));
    if (ok) toast.success("All games published");
  }

  async function handlePublishSession() {
    if (onPublishSession) {
      await flickerSave(async () => {
        await onPublishSession();
      });
      toast.success("Session published");
      return;
    }

    const ok = await persistResult(() => publishWorkspaceSession(sessionId));
    if (ok) toast.success("Session published");
  }

  async function handleUnpublishSession() {
    if (onUnpublishSession) {
      await flickerSave(async () => {
        await onUnpublishSession();
      });
      toast.success("Session unpublished");
      return;
    }

    const ok = await persistResult(() => unpublishWorkspaceSession(sessionId));
    if (ok) toast.success("Session unpublished");
  }

  async function handleSessionVisibility(visibility: Visibility) {
    setLocalVisibility(visibility);

    if (onSetSessionVisibility) {
      await flickerSave(async () => {
        await onSetSessionVisibility(visibility);
      });
      return;
    }

    const ok = await persistResult(() => setSessionPublishVisibility(sessionId, visibility));
    if (!ok) setLocalVisibility(sessionVisibility);
  }

  async function handleGameVisibility(gameId: string, visibility: Visibility) {
    setLocalGames((current) =>
      current.map((game) => (game.id === gameId ? { ...game, visibility } : game)),
    );

    if (onSetGameVisibility) {
      await flickerSave(async () => {
        await onSetGameVisibility(gameId, visibility);
      });
      return;
    }

    const ok = await persistResult(() => setGamePublishVisibility(sessionId, gameId, visibility));
    if (!ok) setLocalGames(games);
  }

  return (
    <div className="space-y-8" data-slot="session-review-publish">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge kind="session" status={sessionStatus} />
          <VisibilityBadge visibility={localVisibility} />
          <div className="flex items-center gap-2 text-sm text-foreground">
            <span className="text-muted-foreground">Visibility</span>
            <NativeSelect
              aria-label="Session visibility"
              className="w-36"
              value={localVisibility}
              onChange={(event) => {
                void handleSessionVisibility(event.currentTarget.value as Visibility);
              }}
            >
              <NativeSelectOption value="private">Private</NativeSelectOption>
              <NativeSelectOption value="public">Public</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleUnpublishSession()}
          >
            Unpublish session
          </Button>
          <Button type="button" size="sm" onClick={() => void handlePublishSession()}>
            Publish session
          </Button>
        </div>
      </div>

      <SessionPublishChecklist
        games={toChecklistGames(localGames)}
        onPublishGame={(gameId) => {
          void handlePublishGame(gameId);
        }}
        onPublishAll={() => {
          void handlePublishAll();
        }}
      />

      <div className="space-y-4">
        <h3 className="font-heading text-base font-medium">Facebook drafts</h3>
        {localGames.length === 0 ? (
          <p className="text-sm text-muted-foreground">No games to preview yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {localGames.map((game: SessionReviewPublishGame) => (
              <li key={game.id}>
                <Card size="sm" className="gap-0 bg-background text-foreground">
                  <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 border-b border-border px-(--card-spacing) py-3">
                    <CardTitle>
                      Game {game.gameNumber}
                      <span className="mt-0.5 block font-normal text-muted-foreground">
                        {game.matchup}
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <span className="text-muted-foreground">Visibility</span>
                      <NativeSelect
                        aria-label={`Game ${game.gameNumber} visibility`}
                        className="w-36"
                        value={game.visibility}
                        onChange={(event) => {
                          void handleGameVisibility(
                            game.id,
                            event.currentTarget.value as Visibility,
                          );
                        }}
                      >
                        <NativeSelectOption value="private">Private</NativeSelectOption>
                        <NativeSelectOption value="public">Public</NativeSelectOption>
                      </NativeSelect>
                    </div>
                  </CardHeader>
                  <CardContent className="px-(--card-spacing) py-4">
                    <FacebookPostPreview
                      title={game.facebookTitle}
                      body={game.facebookBody}
                      onCopy={() => {
                        toast.success("Copied Facebook draft");
                      }}
                    />
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export type { SessionReviewPublishProps };
export { SessionReviewPublish };
