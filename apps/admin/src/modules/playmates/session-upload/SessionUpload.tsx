"use client";

import type { Provider } from "@fe-template/mocks";
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertTitle,
  Button,
} from "@fe-template/ui";
import { InfoIcon } from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  cancelJob,
  getJobs,
  queueRecording,
  queueSession,
  retryJob,
  type QueueUploadsResult,
} from "@/app/(dashboard)/sessions/[id]/upload/actions";

import { useSessionWorkspaceSave } from "../session-workspace-header/SessionWorkspaceSaveContext";
import { UploadMatrix } from "../upload-matrix/UploadMatrix";
import { UploadQueue } from "../upload-queue/UploadQueue";
import {
  hasActiveUploadJobs,
  hasIncompleteJobs,
  hasMissingUploads,
  toUploadMatrixRows,
  toUploadQueueItems,
} from "./map-upload";
import type {
  SessionUploadAsset,
  SessionUploadJob,
  SessionUploadProps,
  SessionUploadRecording,
} from "./SessionUpload.types";

const RESELECT_BANNER =
  "These files exist only in this browser tab. Refreshing requires reselecting files before a real upload.";

const POLL_MS = 400;

function filesMatchHint(file: File, recording: SessionUploadRecording): boolean {
  return (
    file.name === recording.originalFilename &&
    (recording.sizeBytes === null || file.size === recording.sizeBytes)
  );
}

function toastQueueResult(result: QueueUploadsResult) {
  if (!result.success) {
    toast.error(result.error);
    return false;
  }
  if (result.queued === 0 && result.skippedExisting > 0) {
    toast.message("Nothing queued. Provider assets already exist. Use Replace… to start a new job.");
    return true;
  }
  if (result.queued === 0) {
    toast.message("Nothing to queue.");
    return true;
  }
  toast.success(
    result.skippedExisting > 0
      ? `Queued ${result.queued} job(s). Skipped ${result.skippedExisting} existing asset(s).`
      : `Queued ${result.queued} job(s).`,
  );
  return true;
}

function SessionUpload({
  sessionId,
  recordings,
  jobs,
  assets,
  onEnqueue,
  enableJobPolling = true,
}: SessionUploadProps) {
  const { beginSave, endSave } = useSessionWorkspaceSave();
  const [fileByRecordingId, setFileByRecordingId] = useState<Map<string, File>>(() => new Map());
  const [liveJobs, setLiveJobs] = useState<SessionUploadJob[]>(jobs);
  const [liveAssets, setLiveAssets] = useState<SessionUploadAsset[]>(assets);
  const [queueing, setQueueing] = useState(false);
  const [replaceTarget, setReplaceTarget] = useState<{
    recordingId: string;
    provider: Provider;
  } | null>(null);
  const reselectInputRef = useRef<HTMLInputElement>(null);
  const live = Boolean(sessionId) && !onEnqueue && enableJobPolling;
  const shouldPoll = live && hasActiveUploadJobs(liveJobs);

  useEffect(() => {
    setLiveJobs(jobs);
    setLiveAssets(assets);
  }, [jobs, assets]);

  useEffect(() => {
    if (!shouldPoll) return;

    let cancelled = false;

    async function poll() {
      const snapshot = await getJobs(sessionId);
      if (cancelled) return;
      setLiveJobs(snapshot.jobs);
      setLiveAssets(snapshot.assets);
    }

    const intervalId = window.setInterval(() => {
      void poll();
    }, POLL_MS);
    void poll();

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [shouldPoll, sessionId]);

  const matrixRows = useMemo(
    () => toUploadMatrixRows(recordings, liveJobs, liveAssets),
    [recordings, liveJobs, liveAssets],
  );
  const queueItems = useMemo(
    () => toUploadQueueItems(recordings, liveJobs, liveAssets),
    [recordings, liveJobs, liveAssets],
  );

  const showReselectBanner = fileByRecordingId.size === 0 && hasIncompleteJobs(liveJobs);
  const canQueueMissing = recordings.length > 0 && !queueing && hasMissingUploads(recordings, liveJobs, liveAssets);
  const canQueue = recordings.length > 0 && !queueing;

  async function runMutation(work: () => Promise<boolean>) {
    setQueueing(true);
    beginSave();
    try {
      const ok = await work();
      endSave(ok);
    } catch {
      endSave(false);
      toast.error("Could not update uploads.");
    } finally {
      setQueueing(false);
    }
  }

  async function refreshSnapshot() {
    const snapshot = await getJobs(sessionId);
    setLiveJobs(snapshot.jobs);
    setLiveAssets(snapshot.assets);
  }

  async function queueProviders(providers: Provider[]) {
    if (onEnqueue) {
      beginSave();
      try {
        await onEnqueue(providers);
        endSave(true);
      } catch {
        endSave(false);
      }
      return;
    }

    if (!sessionId) {
      toast.error("Missing session id for upload");
      return;
    }

    await runMutation(async () => {
      const result = await queueSession({ sessionId, providers });
      const ok = toastQueueResult(result);
      if (ok) await refreshSnapshot();
      return ok;
    });
  }

  async function onQueueRecording(recordingId: string, provider: Provider) {
    if (onEnqueue) {
      await queueProviders([provider]);
      return;
    }

    await runMutation(async () => {
      const result = await queueRecording({ recordingId, provider });
      const ok = toastQueueResult(result);
      if (ok) await refreshSnapshot();
      return ok;
    });
  }

  async function onRetryJob(jobId: string) {
    await runMutation(async () => {
      const result = await retryJob(jobId);
      if (!result.success) {
        toast.error(result.error);
        return false;
      }
      toast.success("Retry queued.");
      await refreshSnapshot();
      return true;
    });
  }

  async function onReplace(recordingId: string, provider: Provider) {
    setReplaceTarget({ recordingId, provider });
  }

  async function onConfirmReplace() {
    if (!replaceTarget) return;
    const target = replaceTarget;
    setReplaceTarget(null);

    if (onEnqueue) {
      await queueProviders([target.provider]);
      return;
    }

    await runMutation(async () => {
      const result = await queueRecording({
        recordingId: target.recordingId,
        provider: target.provider,
        replace: true,
      });
      if (!result.success) {
        toast.error(result.error);
        return false;
      }
      toast.success(
        target.provider === "youtube"
          ? "Replacing YouTube upload."
          : "Replacing Drive upload.",
      );
      await refreshSnapshot();
      return true;
    });
  }

  async function onCopyError(errorCode: string | undefined, errorMessage: string | undefined) {
    const text = [errorCode, errorMessage].filter(Boolean).join(" ");
    if (!text) {
      toast.error("No error details to copy.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Error copied.");
    } catch {
      toast.error("Could not copy error.");
    }
  }

  async function onCancelJob(jobId: string) {
    await runMutation(async () => {
      const result = await cancelJob(jobId);
      if (!result.success) {
        toast.error(result.error);
        return false;
      }
      toast.success("Upload cancelled.");
      await refreshSnapshot();
      return true;
    });
  }

  function onReselectFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setFileByRecordingId((current) => {
      const next = new Map(current);
      for (const recording of recordings) {
        const match = files.find((file) => filesMatchHint(file, recording));
        if (match) {
          next.set(recording.id, match);
        }
      }
      return next;
    });
  }

  return (
    <div className="space-y-6" data-slot="session-upload">
      {showReselectBanner ? (
        <Alert>
          <InfoIcon />
          <AlertTitle>Reselect files</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <p>{RESELECT_BANNER}</p>
            <div>
              <input
                ref={reselectInputRef}
                type="file"
                multiple
                accept="video/*"
                className="sr-only"
                onChange={onReselectFiles}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => reselectInputRef.current?.click()}
              >
                Reselect files
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!canQueue}
          onClick={() => {
            void queueProviders(["google_drive"]);
          }}
        >
          Queue Drive
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canQueue}
          onClick={() => {
            void queueProviders(["youtube"]);
          }}
        >
          Queue YouTube
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canQueue}
          onClick={() => {
            void queueProviders(["google_drive", "youtube"]);
          }}
        >
          Queue both
        </Button>
        <Button
          type="button"
          disabled={!canQueueMissing}
          onClick={() => {
            void queueProviders(["google_drive", "youtube"]);
          }}
        >
          Queue all missing
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-base font-medium">Matrix</h3>
        <UploadMatrix
          rows={matrixRows}
          busy={queueing}
          onQueueRecording={onQueueRecording}
          onRetryJob={live ? onRetryJob : undefined}
          onCancelJob={live ? onCancelJob : undefined}
          onReplace={onReplace}
          onCopyError={onCopyError}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-base font-medium">Queue</h3>
        <UploadQueue items={queueItems} />
      </div>

      <AlertDialog
        open={replaceTarget !== null}
        onOpenChange={(open) => {
          if (!open) setReplaceTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Replace{" "}
              {replaceTarget?.provider === "youtube" ? "YouTube" : "Drive"} upload?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This archives the current mock asset for this provider only and starts a new upload
              job. The other provider is left unchanged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void onConfirmReplace();
              }}
            >
              Replace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export type { SessionUploadProps };
export { SessionUpload };
