"use client";

import type { UploadJobStatus, Visibility } from "@fe-template/mocks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Empty,
  EmptyHeader,
  EmptyTitle,
  Input,
  Label,
  NativeSelect,
  NativeSelectOption,
} from "@fe-template/ui";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  type FacebookDraftPayload,
  generateDraft,
  markDraftPosted,
  publishAllSessionGames,
  publishSessionGame,
  publishWorkspaceSession,
  setGamePublishVisibility,
  setSessionPublishVisibility,
  unmarkDraftPosted,
  unpublishSessionGame,
  unpublishWorkspaceSession,
  updateDraft,
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

type PendingPublish =
  | { kind: "game"; gameId: string; games: SessionReviewPublishGame[] }
  | { kind: "all"; games: SessionReviewPublishGame[] }
  | { kind: "session"; games: SessionReviewPublishGame[] };

function hasProviderAsset(status: UploadJobStatus | null): boolean {
  return status === "completed";
}

function gameLacksProviderAsset(game: SessionReviewPublishGame): boolean {
  return !hasProviderAsset(game.youtubeStatus) || !hasProviderAsset(game.driveStatus);
}

function missingAssetLabel(game: SessionReviewPublishGame): string {
  const missing: string[] = [];
  if (!hasProviderAsset(game.youtubeStatus)) missing.push("YouTube");
  if (!hasProviderAsset(game.driveStatus)) missing.push("Google Drive");
  return `Game ${game.gameNumber} (${missing.join(" and ")})`;
}

function applyDraftToGame(
  game: SessionReviewPublishGame,
  draft: FacebookDraftPayload,
): SessionReviewPublishGame {
  return {
    ...game,
    facebookDraftId: draft.id,
    facebookTitle: draft.title?.trim() || game.facebookTitle,
    facebookBody: draft.body,
    facebookPostedAt: draft.postedAt ?? null,
    facebookPostedUrl: draft.postedUrl ?? null,
  };
}

function FacebookDraftCard({
  game,
  persistResult,
  onApplyDraft,
}: {
  game: SessionReviewPublishGame;
  persistResult: (action: () => Promise<ActionResult>) => Promise<boolean>;
  onApplyDraft: (draft: FacebookDraftPayload) => void;
}) {
  const [body, setBody] = useState(game.facebookBody);
  const [postedUrl, setPostedUrl] = useState(game.facebookPostedUrl ?? "");
  const posted = Boolean(game.facebookPostedAt);
  const postedCheckboxId = `facebook-posted-${game.id}`;
  const postedUrlId = `facebook-posted-url-${game.id}`;

  useEffect(() => {
    setBody(game.facebookBody);
    setPostedUrl(game.facebookPostedUrl ?? "");
  }, [game.facebookBody, game.facebookPostedUrl]);

  async function runDraftAction(
    action: () => Promise<{ success: boolean; error?: string; draft?: FacebookDraftPayload }>,
    successMessage: string | ((draft: FacebookDraftPayload) => string),
  ): Promise<FacebookDraftPayload | null> {
    let draft: FacebookDraftPayload | undefined;
    const ok = await persistResult(async () => {
      const result = await action();
      if (result.success && result.draft) {
        draft = result.draft;
      }
      return result;
    });
    if (!ok || !draft) return null;
    onApplyDraft(draft);
    setBody(draft.body);
    if (draft.postedUrl) setPostedUrl(draft.postedUrl);
    toast.success(
      typeof successMessage === "function" ? successMessage(draft) : successMessage,
    );
    return draft;
  }

  async function handleGenerate() {
    await runDraftAction(() => generateDraft(game.id), "Facebook draft generated");
  }

  async function handleSave() {
    await runDraftAction(async () => {
      let draftId = game.facebookDraftId;
      if (!draftId) {
        const generated = await generateDraft(game.id);
        if (!generated.success) return generated;
        draftId = generated.draft.id;
      }
      return updateDraft(draftId, body);
    }, (draft) => `Draft saved (v${draft.version})`);
  }

  async function handlePostedChange(next: boolean) {
    if (!next) {
      if (!game.facebookDraftId) return;
      await runDraftAction(
        () => unmarkDraftPosted(game.facebookDraftId as string),
        "Cleared Facebook posted mark",
      );
      return;
    }

    await runDraftAction(async () => {
      let draftId = game.facebookDraftId;
      if (!draftId) {
        const generated = await generateDraft(game.id);
        if (!generated.success) return generated;
        draftId = generated.draft.id;
      }
      return markDraftPosted(draftId, postedUrl.trim() || undefined);
    }, "Marked as posted to Facebook Group");
  }

  async function handlePostedUrlBlur() {
    if (!posted || !game.facebookDraftId) return;
    await runDraftAction(
      () => markDraftPosted(game.facebookDraftId as string, postedUrl.trim() || undefined),
      "Facebook post URL saved",
    );
  }

  return (
    <div className="space-y-4">
      <FacebookPostPreview
        title={game.facebookTitle}
        body={body}
        onChange={setBody}
        onCopy={() => {
          toast.success("Copied Facebook draft");
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => void handleGenerate()}>
          Generate
        </Button>
        <Button type="button" size="sm" onClick={() => void handleSave()}>
          Save draft
        </Button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox
            id={postedCheckboxId}
            checked={posted}
            onCheckedChange={(next) => {
              void handlePostedChange(next === true);
            }}
          />
          <label htmlFor={postedCheckboxId}>Marked as posted to Facebook Group</label>
        </div>
        <div className="space-y-1">
          <Label htmlFor={postedUrlId}>Facebook post URL (optional)</Label>
          <Input
            id={postedUrlId}
            type="url"
            inputMode="url"
            placeholder="https://www.facebook.com/groups/…"
            value={postedUrl}
            onChange={(event) => setPostedUrl(event.currentTarget.value)}
            onBlur={() => {
              void handlePostedUrlBlur();
            }}
          />
        </div>
      </div>
    </div>
  );
}

function SessionReviewPublish({
  sessionId,
  sessionStatus,
  sessionVisibility,
  facebookGroupUrl,
  games,
  onPublishGame,
  onUnpublishGame,
  onPublishAll,
  onPublishSession,
  onUnpublishSession,
  onSetSessionVisibility,
  onSetGameVisibility,
}: SessionReviewPublishProps) {
  const [localGames, setLocalGames] = useState(games);
  const [localVisibility, setLocalVisibility] = useState(sessionVisibility);
  const [alsoPublishGames, setAlsoPublishGames] = useState(true);
  const [pendingPublish, setPendingPublish] = useState<PendingPublish | null>(null);
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
    let result: ActionResult;
    try {
      result = await action();
    } catch {
      endSave(false);
      toast.error("Could not update publish state.");
      return false;
    }
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

  async function runPublishGame(gameId: string) {
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

  async function handleUnpublishGame(gameId: string) {
    if (onUnpublishGame) {
      await flickerSave(async () => {
        await onUnpublishGame(gameId);
      });
      toast.success("Game unpublished");
      return;
    }

    if (!sessionId) {
      toast.error("Missing session id for unpublish");
      return;
    }

    const ok = await persistResult(() => unpublishSessionGame(sessionId, gameId));
    if (ok) toast.success("Game unpublished");
  }

  async function runPublishAll() {
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

  async function runPublishSession() {
    if (onPublishSession) {
      await flickerSave(async () => {
        await onPublishSession({ alsoPublishGames });
      });
      toast.success(
        alsoPublishGames ? "Session and games published" : "Session published",
      );
      return;
    }

    const ok = await persistResult(() =>
      publishWorkspaceSession(sessionId, { alsoPublishGames }),
    );
    if (ok) {
      toast.success(alsoPublishGames ? "Session and games published" : "Session published");
    }
  }

  function requestPublishGame(gameId: string) {
    const game = localGames.find((row) => row.id === gameId);
    if (game && gameLacksProviderAsset(game)) {
      setPendingPublish({ kind: "game", gameId, games: [game] });
      return;
    }
    void runPublishGame(gameId);
  }

  function requestPublishAll() {
    const incomplete = localGames.filter(gameLacksProviderAsset);
    if (incomplete.length > 0) {
      setPendingPublish({ kind: "all", games: incomplete });
      return;
    }
    void runPublishAll();
  }

  function requestPublishSession() {
    const selected = alsoPublishGames ? localGames.filter(gameLacksProviderAsset) : [];
    if (selected.length > 0) {
      setPendingPublish({ kind: "session", games: selected });
      return;
    }
    void runPublishSession();
  }

  async function confirmPendingPublish() {
    const pending = pendingPublish;
    setPendingPublish(null);
    if (!pending) return;
    if (pending.kind === "game") {
      await runPublishGame(pending.gameId);
      return;
    }
    if (pending.kind === "all") {
      await runPublishAll();
      return;
    }
    await runPublishSession();
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

  const warningGames = pendingPublish?.games ?? [];

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
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox
              id="also-publish-games"
              checked={alsoPublishGames}
              onCheckedChange={(next) => {
                setAlsoPublishGames(next === true);
              }}
            />
            <label htmlFor="also-publish-games">Also publish all games</label>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleUnpublishSession()}
          >
            Unpublish session
          </Button>
          <Button type="button" size="sm" onClick={() => void requestPublishSession()}>
            Publish session
          </Button>
        </div>
      </div>

      <SessionPublishChecklist
        games={toChecklistGames(localGames)}
        onPublishGame={(gameId) => {
          requestPublishGame(gameId);
        }}
        onUnpublishGame={(gameId) => {
          void handleUnpublishGame(gameId);
        }}
        onPublishAll={() => {
          requestPublishAll();
        }}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-heading text-base font-medium">Facebook drafts</h3>
          {facebookGroupUrl ? (
            <a
              href={facebookGroupUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Open group
            </a>
          ) : null}
        </div>
        {localGames.length === 0 ? (
          <Empty className="min-h-0 border p-4">
            <EmptyHeader>
              <EmptyTitle className="font-normal text-muted-foreground">
                No games to preview yet
              </EmptyTitle>
            </EmptyHeader>
          </Empty>
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
                    <FacebookDraftCard
                      game={game}
                      persistResult={persistResult}
                      onApplyDraft={(draft) => {
                        setLocalGames((current) =>
                          current.map((row) =>
                            row.id === game.id ? applyDraftToGame(row, draft) : row,
                          ),
                        );
                      }}
                    />
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog
        open={pendingPublish !== null}
        onOpenChange={(open) => {
          if (!open) setPendingPublish(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish without every provider asset?</AlertDialogTitle>
            <AlertDialogDescription>
              {warningGames.length === 1 && warningGames[0]
                ? `${missingAssetLabel(warningGames[0])} is missing. Publishing continues anyway.`
                : `These games are missing a YouTube or Google Drive asset: ${warningGames
                    .map(missingAssetLabel)
                    .join("; ")}. Publishing continues anyway.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void confirmPendingPublish();
              }}
            >
              Publish anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export type { SessionReviewPublishProps };
export { SessionReviewPublish };
