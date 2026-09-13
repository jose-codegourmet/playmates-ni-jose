"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { CameraSide, RecordingStatus } from "@fe-template/mocks";
import {
  Badge,
  Button,
  Card,
  CardContent,
  NativeSelect,
  NativeSelectOption,
} from "@fe-template/ui";
import { GripVerticalIcon } from "lucide-react";

import { StatusBadge } from "../status-badge/StatusBadge";
import type { RecordingCardProps } from "./RecordingCard.types";

const CAMERA_SIDE_LABEL: Record<CameraSide, string> = {
  A: "Side A",
  B: "Side B",
  UNASSIGNED: "Unassigned",
};

function recordingStatusForSide(cameraSide: CameraSide): RecordingStatus {
  return cameraSide === "UNASSIGNED" ? "imported" : "organized";
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

function RecordingCard({
  id,
  originalFilename,
  displayName,
  sizeBytes,
  durationSeconds,
  cameraSide,
  partNumber,
  gameLabel,
  droppableId = "unassigned",
  moveTargets,
  onMoveTo,
}: RecordingCardProps) {
  const title = displayName?.trim() || originalFilename;
  const showOriginalFilename = Boolean(displayName?.trim()) && displayName !== originalFilename;
  const metaBits = [
    formatFileSize(sizeBytes),
    durationSeconds === undefined ? null : formatDuration(durationSeconds),
  ].filter((bit): bit is string => bit !== null);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type: "recording", laneId: droppableId },
  });

  return (
    <Card
      size="sm"
      tabIndex={0}
      data-slot="recording-card"
      data-recording-id={id}
      className="flex-row items-center gap-2 py-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.55 : 1,
        zIndex: isDragging ? 20 : undefined,
      }}
    >
      <Button
        ref={setNodeRef}
        type="button"
        variant="ghost"
        size="icon-xs"
        className="ml-2 shrink-0 cursor-grab text-muted-foreground"
        aria-label="Drag to assign recording"
        {...listeners}
        {...attributes}
      >
        <GripVerticalIcon />
      </Button>
      <CardContent className="min-w-0 flex-1 px-(--card-spacing) py-0">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="truncate font-heading text-sm font-medium leading-snug">{title}</p>
          {showOriginalFilename ? (
            <p className="truncate text-xs text-muted-foreground">{originalFilename}</p>
          ) : null}
          <p className="text-xs text-muted-foreground">{metaBits.join(" · ")}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={cameraSide === "UNASSIGNED" ? "outline" : "secondary"}>
              {CAMERA_SIDE_LABEL[cameraSide]}
            </Badge>
            <Badge variant="outline">Part {partNumber}</Badge>
            {gameLabel ? <Badge variant="ghost">{gameLabel}</Badge> : null}
            <StatusBadge kind="recording" status={recordingStatusForSide(cameraSide)} />
          </div>
          {moveTargets && moveTargets.length > 0 && onMoveTo ? (
            <label
              htmlFor={`move-to-${id}`}
              className="flex min-w-0 flex-col gap-1"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <span className="text-xs text-muted-foreground">Move to…</span>
              <NativeSelect
                id={`move-to-${id}`}
                size="sm"
                className="w-full max-w-full"
                aria-label="Move to"
                value={droppableId}
                onPointerDown={(event) => event.stopPropagation()}
                onChange={(event) => {
                  const next = event.target.value;
                  if (next !== droppableId) {
                    onMoveTo(next);
                  }
                }}
              >
                {moveTargets.map((target) => (
                  <NativeSelectOption key={target.value} value={target.value}>
                    {target.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export type { RecordingCardProps };
export { RecordingCard };
