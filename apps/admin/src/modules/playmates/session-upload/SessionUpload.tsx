"use client";

import type { Provider } from "@fe-template/mocks";
import { Alert, AlertDescription, AlertTitle, Button } from "@fe-template/ui";
import { InfoIcon } from "lucide-react";
import { type ChangeEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { enqueueSessionUploads } from "@/app/(dashboard)/sessions/[id]/upload/actions";

import { useSessionWorkspaceSave } from "../session-workspace-header/SessionWorkspaceSaveContext";
import { UploadMatrix } from "../upload-matrix/UploadMatrix";
import { UploadQueue } from "../upload-queue/UploadQueue";
import { hasIncompleteJobs, toUploadMatrixRows, toUploadQueueItems } from "./map-upload";
import type { SessionUploadProps, SessionUploadRecording } from "./SessionUpload.types";

const RESELECT_BANNER =
  "These files exist only in this browser tab. Refreshing requires reselecting files before a real upload.";

function filesMatchHint(file: File, recording: SessionUploadRecording): boolean {
  return (
    file.name === recording.originalFilename &&
    (recording.sizeBytes === null || file.size === recording.sizeBytes)
  );
}

function SessionUpload({ sessionId, recordings, jobs, assets, onEnqueue }: SessionUploadProps) {
  const { beginSave, endSave } = useSessionWorkspaceSave();
  const [fileByRecordingId, setFileByRecordingId] = useState<Map<string, File>>(() => new Map());
  const [queueing, setQueueing] = useState(false);
  const reselectInputRef = useRef<HTMLInputElement>(null);

  const matrixRows = useMemo(
    () => toUploadMatrixRows(recordings, jobs, assets),
    [recordings, jobs, assets],
  );
  const queueItems = useMemo(
    () => toUploadQueueItems(recordings, jobs, assets),
    [recordings, jobs, assets],
  );

  const showReselectBanner = fileByRecordingId.size === 0 && hasIncompleteJobs(jobs);

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

    setQueueing(true);
    beginSave();
    const result = await enqueueSessionUploads(sessionId, providers);
    setQueueing(false);

    if (!result.success) {
      endSave(false);
      toast.error(result.error);
      return;
    }

    endSave(true);
    if (result.queued === 0 && result.skippedExisting > 0) {
      toast.message("Nothing queued. Provider assets already exist.");
      return;
    }
    if (result.queued === 0) {
      toast.message("Nothing to queue.");
      return;
    }
    toast.success(
      result.skippedExisting > 0
        ? `Queued ${result.queued} job(s). Skipped ${result.skippedExisting} existing asset(s).`
        : `Queued ${result.queued} job(s).`,
    );
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

  const canQueue = recordings.length > 0 && !queueing;

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
          disabled={!canQueue}
          onClick={() => {
            void queueProviders(["google_drive", "youtube"]);
          }}
        >
          Queue both
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-base font-medium">Matrix</h3>
        <UploadMatrix rows={matrixRows} />
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-base font-medium">Queue</h3>
        <UploadQueue items={queueItems} />
      </div>
    </div>
  );
}

export type { SessionUploadProps };
export { SessionUpload };
