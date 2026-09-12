import type { CameraSide, RecordingStatus } from "@fe-template/mocks";
import { Badge, Button, Card, CardContent } from "@fe-template/ui";
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
  originalFilename,
  displayName,
  sizeBytes,
  durationSeconds,
  cameraSide,
  partNumber,
  gameLabel,
}: RecordingCardProps) {
  const title = displayName?.trim() || originalFilename;
  const showOriginalFilename = Boolean(displayName?.trim()) && displayName !== originalFilename;
  const metaBits = [
    formatFileSize(sizeBytes),
    durationSeconds === undefined ? null : formatDuration(durationSeconds),
  ].filter((bit): bit is string => bit !== null);

  return (
    <Card size="sm" className="flex-row items-center gap-2 py-2">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="ml-2 shrink-0 cursor-grab text-muted-foreground"
        aria-label="Drag to assign recording"
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
        </div>
      </CardContent>
    </Card>
  );
}

export type { RecordingCardProps };
export { RecordingCard };
