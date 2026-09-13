"use client";

import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, Empty, EmptyHeader, EmptyTitle } from "@fe-template/ui";

import { RecordingCard } from "../recording-card/RecordingCard";
import type { CameraSideLaneProps } from "./CameraSideLane.types";

function CameraSideLane({
  side,
  recordings,
  droppableId,
  moveTargets,
  onMoveRecording,
}: CameraSideLaneProps) {
  const label = `Side ${side}`;
  const isEmpty = recordings.length === 0;
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: { type: "lane" },
  });

  return (
    <Card
      ref={setNodeRef}
      size="sm"
      data-slot="camera-side-lane"
      data-side={side}
      data-droppable-id={droppableId}
      aria-label={label}
      className={
        isOver
          ? "flex h-full min-h-48 flex-col gap-0 bg-background text-foreground ring-2 ring-ring"
          : "flex h-full min-h-48 flex-col gap-0 bg-background text-foreground"
      }
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
                <RecordingCard
                  {...recording}
                  droppableId={droppableId}
                  moveTargets={moveTargets}
                  onMoveTo={
                    onMoveRecording ? (nextId) => onMoveRecording(recording.id, nextId) : undefined
                  }
                />
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
