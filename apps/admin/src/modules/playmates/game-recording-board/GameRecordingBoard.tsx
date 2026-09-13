"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  type PointerSensorOptions,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, Empty, EmptyHeader, EmptyTitle } from "@fe-template/ui";

import { CameraSideLane } from "../camera-side-lane/CameraSideLane";
import { RecordingCard } from "../recording-card/RecordingCard";
import type { RecordingMoveTarget } from "../recording-card/RecordingCard.types";

import { gameSideDroppableId, parseDroppableId, UNASSIGNED_DROPPABLE_ID } from "./droppable-ids";
import type { GameRecordingBoardProps } from "./GameRecordingBoard.types";

function isMoveControlTarget(target: EventTarget | null): boolean {
  let node = target instanceof Element ? target : null;
  while (node) {
    const slot = node.getAttribute("data-slot");
    if (
      slot === "native-select" ||
      slot === "native-select-wrapper" ||
      node.tagName === "SELECT" ||
      node.tagName === "OPTION" ||
      node.tagName === "LABEL"
    ) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
}

class LanePointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent }: { nativeEvent: PointerEvent }) => {
        if (!nativeEvent.isPrimary || nativeEvent.button !== 0) {
          return false;
        }
        return !isMoveControlTarget(nativeEvent.target);
      },
    },
  ];
}

function laneCollisionDetection(...args: Parameters<typeof closestCenter>) {
  const [input] = args;
  return closestCenter({
    ...input,
    droppableContainers: input.droppableContainers.filter(
      (container) => container.data.current?.type === "lane",
    ),
  });
}

function UnassignedColumn({
  recordings,
  moveTargets,
  onMoveRecording,
}: {
  recordings: GameRecordingBoardProps["unassigned"];
  moveTargets: RecordingMoveTarget[];
  onMoveRecording: (recordingId: string, droppableId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: UNASSIGNED_DROPPABLE_ID,
    data: { type: "lane" },
  });

  return (
    <div
      ref={setNodeRef}
      data-droppable-id={UNASSIGNED_DROPPABLE_ID}
      className={
        isOver
          ? "flex min-h-32 min-w-0 flex-1 flex-col rounded-lg ring-2 ring-ring"
          : "flex min-h-32 min-w-0 flex-1 flex-col"
      }
    >
      {recordings.length === 0 ? (
        <Empty className="min-h-32 border border-dashed border-border bg-muted/30">
          <EmptyHeader>
            <EmptyTitle>No unassigned files</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="flex flex-col gap-2">
          {recordings.map((recording) => (
            <li key={recording.id}>
              <RecordingCard
                {...recording}
                droppableId={UNASSIGNED_DROPPABLE_ID}
                moveTargets={moveTargets}
                onMoveTo={(nextId) => onMoveRecording(recording.id, nextId)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GameRecordingBoard({ unassigned, games, onAssignRecording }: GameRecordingBoardProps) {
  const sensors = useSensors(
    useSensor(LanePointerSensor, {
      activationConstraint: { distance: 6 },
    } satisfies PointerSensorOptions),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const moveTargets: RecordingMoveTarget[] = [
    { value: UNASSIGNED_DROPPABLE_ID, label: "Unassigned" },
    ...games.flatMap((game) => [
      { value: gameSideDroppableId(game.id, "A"), label: `Game ${game.gameNumber} · Side A` },
      { value: gameSideDroppableId(game.id, "B"), label: `Game ${game.gameNumber} · Side B` },
    ]),
  ];

  function assignToDroppable(recordingId: string, droppableId: string) {
    const target = parseDroppableId(droppableId);
    if (!target) {
      return;
    }
    onAssignRecording?.(recordingId, target);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }
    assignToDroppable(String(active.id), String(over.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={laneCollisionDetection}
      onDragEnd={handleDragEnd}
    >
      <div
        data-slot="game-recording-board"
        className="grid gap-6 bg-background text-foreground lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]"
      >
        <section
          aria-labelledby="game-recording-board-unassigned-heading"
          className="flex min-w-0 flex-col gap-3"
        >
          <h2
            id="game-recording-board-unassigned-heading"
            className="font-heading text-base font-medium"
          >
            Unassigned Files
          </h2>
          <UnassignedColumn
            recordings={unassigned}
            moveTargets={moveTargets}
            onMoveRecording={assignToDroppable}
          />
        </section>

        <section
          aria-labelledby="game-recording-board-workspace-heading"
          className="flex min-w-0 flex-col gap-4"
        >
          <h2
            id="game-recording-board-workspace-heading"
            className="font-heading text-base font-medium"
          >
            Game Workspace
          </h2>
          {games.length === 0 ? (
            <Empty className="min-h-32 border border-dashed border-border bg-muted/30">
              <EmptyHeader>
                <EmptyTitle>No games yet</EmptyTitle>
              </EmptyHeader>
            </Empty>
          ) : (
            <ol className="flex flex-col gap-4">
              {games.map((game) => (
                <li key={game.id}>
                  <Card size="sm" className="gap-0 bg-background text-foreground">
                    <CardHeader className="border-b border-border px-(--card-spacing) py-2">
                      <h3 className="font-heading text-sm font-medium">Game {game.gameNumber}</h3>
                    </CardHeader>
                    <CardContent className="grid gap-3 px-(--card-spacing) py-3 md:grid-cols-2">
                      <CameraSideLane
                        side="A"
                        recordings={game.sides.A}
                        droppableId={gameSideDroppableId(game.id, "A")}
                        moveTargets={moveTargets}
                        onMoveRecording={assignToDroppable}
                      />
                      <CameraSideLane
                        side="B"
                        recordings={game.sides.B}
                        droppableId={gameSideDroppableId(game.id, "B")}
                        moveTargets={moveTargets}
                        onMoveRecording={assignToDroppable}
                      />
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </DndContext>
  );
}

export type { GameRecordingBoardProps };
export { GameRecordingBoard };
