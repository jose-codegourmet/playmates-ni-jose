"use client";

import { Alert, AlertDescription, AlertTitle, Badge, Button, DataTable } from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { importSessionRecordings } from "@/app/(dashboard)/sessions/actions";
import { RecordingDropzone } from "@/modules/playmates/recording-dropzone/RecordingDropzone";

import type {
  SessionImportGame,
  SessionImportProps,
  SessionImportRecording,
} from "./SessionImport.types";

type ImportTableRow = SessionImportRecording & {
  error?: string;
  sourceAttached: boolean;
};

const VIDEO_EXT = /\.(mov|mp4|m4v|avi|mkv|webm)$/i;
const FILE_BANNER =
  "These files exist only in this browser tab. Refreshing requires reselecting files before a real upload.";

function isVideoLike(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  return VIDEO_EXT.test(file.name);
}

function formatFileSize(sizeBytes: number | null): string {
  if (sizeBytes === null) return "—";
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatLastModified(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

function assignmentLabel(recording: SessionImportRecording, games: SessionImportGame[]): string {
  const game = recording.gameId ? games.find((row) => row.id === recording.gameId) : undefined;
  const gameLabel = game
    ? `Game ${game.gameNumber ?? "?"}`
    : recording.gameId
      ? "Game"
      : "Unassigned";
  const side = recording.cameraSide === "UNASSIGNED" ? "no side" : `Side ${recording.cameraSide}`;
  return `${gameLabel} · ${side}`;
}

function filesMatchHint(file: File, recording: SessionImportRecording): boolean {
  return (
    file.name === recording.originalFilename &&
    (recording.sizeBytes === null || file.size === recording.sizeBytes)
  );
}

function SessionImport({ sessionId, recordings, games }: SessionImportProps) {
  const router = useRouter();
  const [fileByRecordingId, setFileByRecordingId] = useState<Map<string, File>>(() => new Map());
  const [rejected, setRejected] = useState<ImportTableRow[]>([]);
  const [importing, setImporting] = useState(false);
  const reselectTargetId = useRef<string | null>(null);
  const reselectInputRef = useRef<HTMLInputElement>(null);

  const attachedCount = fileByRecordingId.size;
  const needsReselect = recordings.length > 0 && attachedCount < recordings.length;

  const rows = useMemo<ImportTableRow[]>(() => {
    const persisted = recordings.map((recording) => ({
      ...recording,
      sourceAttached: fileByRecordingId.has(recording.id),
    }));
    return [...persisted, ...rejected];
  }, [recordings, rejected, fileByRecordingId]);

  async function handleFiles(files: File[]) {
    if (files.length === 0) return;

    const accepted: File[] = [];
    const nextRejected: ImportTableRow[] = [];
    const isDev = process.env.NODE_ENV === "development";

    files.forEach((file, index) => {
      const videoLike = isVideoLike(file);
      if (!videoLike && !isDev) {
        nextRejected.push({
          id: `reject-${Date.now()}-${index}`,
          originalFilename: file.name,
          mimeType: file.type || null,
          sizeBytes: file.size,
          localLastModifiedAt: new Date(file.lastModified).toISOString(),
          gameId: null,
          cameraSide: "UNASSIGNED",
          sourceAttached: false,
          error: "Not a video file. This file was not imported.",
        });
        return;
      }
      if (!videoLike && isDev) {
        console.warn(
          `[session-import] Accepting non-video file in development: ${file.name} (${file.type || "unknown mime"})`,
        );
      }
      accepted.push(file);
    });

    if (nextRejected.length > 0) {
      setRejected((current) => [...current, ...nextRejected]);
    }

    if (accepted.length === 0) {
      return;
    }

    setImporting(true);
    const result = await importSessionRecordings(
      sessionId,
      accepted.map((file) => ({
        originalFilename: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        localLastModifiedAt: new Date(file.lastModified).toISOString(),
      })),
    );
    setImporting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setFileByRecordingId((current) => {
      const next = new Map(current);
      result.recordings.forEach((recording, index) => {
        const file = accepted[index];
        if (file) next.set(recording.id, file);
      });
      return next;
    });

    toast.success(
      result.recordings.length === 1
        ? "Imported 1 recording"
        : `Imported ${result.recordings.length} recordings`,
    );
    router.refresh();
  }

  const openReselect = useCallback((recordingId: string) => {
    reselectTargetId.current = recordingId;
    reselectInputRef.current?.click();
  }, []);

  function onReselectChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const targetId = reselectTargetId.current;
    event.target.value = "";
    reselectTargetId.current = null;
    if (!file || !targetId) return;

    const target = recordings.find((row) => row.id === targetId);
    if (target && !filesMatchHint(file, target)) {
      toast.message("Attached selected file", {
        description: `Filename or size differs from ${target.originalFilename}. Manual pick accepted.`,
      });
    }

    setFileByRecordingId((current) => {
      const next = new Map(current);
      next.set(targetId, file);
      return next;
    });
  }

  const columns = useMemo<ColumnDef<ImportTableRow>[]>(
    () => [
      {
        accessorKey: "originalFilename",
        header: "Filename",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium">{row.original.originalFilename}</p>
            {row.original.error ? (
              <p className="text-xs text-destructive">{row.original.error}</p>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "sizeBytes",
        header: "Size",
        cell: ({ row }) => formatFileSize(row.original.sizeBytes),
      },
      {
        accessorKey: "mimeType",
        header: "MIME",
        cell: ({ row }) => row.original.mimeType || "—",
      },
      {
        accessorKey: "localLastModifiedAt",
        header: "Last modified",
        cell: ({ row }) => formatLastModified(row.original.localLastModifiedAt),
      },
      {
        id: "assignment",
        header: "Game / side",
        cell: ({ row }) => assignmentLabel(row.original, games),
      },
      {
        id: "source",
        header: "Local file",
        cell: ({ row }) => {
          if (row.original.error) {
            return <Badge variant="destructive">Rejected</Badge>;
          }
          if (row.original.sourceAttached) {
            return <Badge variant="secondary">In this tab</Badge>;
          }
          return (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => openReselect(row.original.id)}
            >
              Reselect
            </Button>
          );
        },
      },
    ],
    [games, openReselect],
  );

  return (
    <div className="space-y-6">
      <input ref={reselectInputRef} type="file" hidden onChange={onReselectChange} />
      <Alert>
        <InfoIcon />
        <AlertTitle>Local files stay in this tab</AlertTitle>
        <AlertDescription>{FILE_BANNER}</AlertDescription>
      </Alert>
      {needsReselect ? (
        <Alert variant="destructive">
          <InfoIcon />
          <AlertTitle>Reselect local files</AlertTitle>
          <AlertDescription>
            Metadata is saved, but browser File handles were lost. Use Reselect on each row before a
            real upload.
          </AlertDescription>
        </Alert>
      ) : null}
      <RecordingDropzone
        restrictToVideo={false}
        disabled={importing}
        onFiles={(files) => {
          void handleFiles(files);
        }}
      />
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recordings imported yet.</p>
      ) : (
        <DataTable columns={columns} data={rows} pageSize={20} />
      )}
    </div>
  );
}

export type { SessionImportProps };
export { SessionImport };
