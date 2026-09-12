"use client";

import { Card, CardContent, CardHeader, Empty, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import type { DragEvent } from "react";

import { RecordingCard } from "../recording-card/RecordingCard";
import type { CameraSideLaneProps } from "./CameraSideLane.types";

const RECORDING_ID_MIME = "application/x-playmates-recording-id";

function readDroppedRecordingId(dataTransfer: DataTransfer): string | null {
  const typed = dataTransfer.getData(RECORDING_ID_MIME).trim();
  if (typed) {
    return typed;
  }

  const plain = dataTransfer.getData("text/plain").trim();
  return plain || null;
}

function CameraSideLane({ side, recordings, onDropRecording }: CameraSideLaneProps) {
  const label = `Side ${side}`;
  const isEmpty = recordings.length === 0;

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = onDropRecording ? "move" : "none";
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    const recordingId = readDroppedRecordingId(event.dataTransfer);
    if (!recordingId) {
      return;
    }

    onDropRecording?.(recordingId);
  }

  return (
    <Card
      size="sm"
      data-slot="camera-side-lane"
      data-side={side}
      aria-label={label}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex h-full min-h-48 flex-col gap-0 bg-background text-foreground"
    >
      <CardHeader className="border-b border-border px-(--card-spacing) py-2">
        <p className="font-heading text-sm font-medium">{label}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 px-(--card-spacing) py-2">
        {isEmpty ? (
          <Empty className="min-h-32 flex-1 border border-dashed border-border bg-muted/30">
            <EmptyHeader>
              <EmptyTitle>Drop recordings here</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-2">
            {recordings.map((recording) => (
              <li key={recording.id}>
                <RecordingCard {...recording} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export type { CameraSideLaneProps };
export { CameraSideLane };
