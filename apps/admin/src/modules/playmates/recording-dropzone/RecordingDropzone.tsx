"use client";

import { Button, cn } from "@fe-template/ui";
import { UploadIcon } from "lucide-react";
import { useId, useRef, useState } from "react";

import type { RecordingDropzoneFileMeta, RecordingDropzoneProps } from "./RecordingDropzone.types";

function isVideoFile(file: File): boolean {
  if (file.type.startsWith("video/")) {
    return true;
  }

  return /\.(mov|mp4|m4v|avi|mkv|webm)$/i.test(file.name);
}

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(durationSeconds: number): string {
  const rounded = Math.max(0, Math.floor(durationSeconds));
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function FilePreviewList({ files }: { files: RecordingDropzoneFileMeta[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {files.map((file) => {
        const bits = [
          formatFileSize(file.sizeBytes),
          file.durationSeconds === undefined ? null : formatDuration(file.durationSeconds),
        ].filter((bit): bit is string => bit !== null);

        return (
          <li
            key={`${file.name}-${file.sizeBytes}`}
            className="flex min-w-0 items-baseline justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2"
          >
            <span className="truncate font-heading text-sm font-medium">{file.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">{bits.join(" · ")}</span>
          </li>
        );
      })}
    </ul>
  );
}

function RecordingDropzone({
  filesMeta,
  children,
  onFiles,
  restrictToVideo = true,
  dragActive: dragActiveOverride,
  disabled = false,
  className,
  id,
}: RecordingDropzoneProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragDepth, setDragDepth] = useState(0);
  const isDragActive = dragActiveOverride ?? dragDepth > 0;

  function emitFiles(fileList: FileList | File[] | null) {
    if (disabled || !fileList) {
      return;
    }

    const files = Array.from(fileList).filter((file) =>
      restrictToVideo ? isVideoFile(file) : true,
    );
    if (files.length === 0) {
      return;
    }

    onFiles(files);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-4 bg-background text-foreground", className)}>
      <section
        aria-label="Import video recordings"
        data-slot="recording-dropzone"
        data-drag-active={isDragActive || undefined}
        onDragEnter={(event) => {
          event.preventDefault();
          if (disabled) {
            return;
          }
          setDragDepth((depth) => depth + 1);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = disabled ? "none" : "copy";
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragDepth((depth) => Math.max(0, depth - 1));
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragDepth(0);
          emitFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex min-h-56 flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center",
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={restrictToVideo ? "video/*" : undefined}
          multiple
          hidden
          disabled={disabled}
          onChange={(event) => {
            emitFiles(event.target.files);
          }}
        />
        <UploadIcon aria-hidden className="mb-3 size-8 text-muted-foreground" />
        <p className="font-heading text-sm font-medium">Drop video files here</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Multiple videos accepted. Files are not uploaded from this control.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          disabled={disabled}
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          Browse videos
        </Button>
      </section>
      {children ??
        (filesMeta && filesMeta.length > 0 ? <FilePreviewList files={filesMeta} /> : null)}
    </div>
  );
}

export type { RecordingDropzoneFileMeta, RecordingDropzoneProps };
export { RecordingDropzone };
