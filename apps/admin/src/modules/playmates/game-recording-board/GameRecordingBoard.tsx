"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  type PointerSensorOptions,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@fe-template/ui";

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
      slot === "select-trigger" ||
      slot === "select-content" ||
      slot === "select-item" ||
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

function organizeCollisionDetection(...args: Parameters<typeof closestCenter>) {
  const [input] = args;
  const laneContainers = input.droppableContainers.filter(
    (container) => container.data.current?.type === "lane",
  );
  const sortableContainers = input.droppableContainers.filter(
    (container) => container.data.current?.sortable,
  );
  const activeLaneId = input.active.data.current?.laneId;
  const closestSortable = closestCenter({
    ...input,
    droppableContainers: sortableContainers,
  });
  const sortableLaneId = closestSortable[0]?.data?.droppableContainer?.data.current?.laneId;
  if (closestSortable.length > 0 && sortableLaneId === activeLaneId) {
    return closestSortable;
  }
  const pointerLanes = pointerWithin({
    ...input,
    droppableContainers: laneContainers,
  });
  if (pointerLanes.length > 0) {
    return pointerLanes;
  }
  return closestCenter({
    ...input,
    droppableContainers: laneContainers,
  });
}

function laneIdsForBoard(
  unassigned: GameRecordingBoardProps["unassigned"],
  games: GameRecordingBoardProps["games"],
): Map<string, string> {
  const lanes = new Map<string, string>();
  for (const recording of unassigned) {
    lanes.set(recording.id, UNASSIGNED_DROPPABLE_ID);
  }
  for (const game of games) {
    for (const recording of game.sides.A) {
      lanes.set(recording.id, gameSideDroppableId(game.id, "A"));
    }
    for (const recording of game.sides.B) {
      lanes.set(recording.id, gameSideDroppableId(game.id, "B"));
    }
  }
  return lanes;
}

function recordingIdsInLane(
  droppableId: string,
  unassigned: GameRecordingBoardProps["unassigned"],
  games: GameRecordingBoardProps["games"],
): string[] {
  if (droppableId === UNASSIGNED_DROPPABLE_ID) {
    return unassigned.map((recording) => recording.id);
  }
  const target = parseDroppableId(droppableId);
  if (!target?.gameId || (target.cameraSide !== "A" && target.cameraSide !== "B")) {
    return [];
  }
  const game = games.find((row) => row.id === target.gameId);
  return game ? game.sides[target.cameraSide].map((recording) => recording.id) : [];
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
        <SortableContext
          items={recordings.map((recording) => recording.id)}
          strategy={verticalListSortingStrategy}
        >
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
        </SortableContext>
      )}
    </div>
  );
}

function GameRecordingBoard({
  unassigned,
  games,
  onAssignRecording,
  onReorderLane,
  onRemoveGame,
}: GameRecordingBoardProps) {
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
    const activeId = String(active.id);
    const overId = String(over.id);
    const lanes = laneIdsForBoard(unassigned, games);
    const activeLane =
      (typeof active.data.current?.laneId === "string" && active.data.current.laneId) ||
      lanes.get(activeId);
    const overLane =
      parseDroppableId(overId) !== null
        ? overId
        : (typeof over.data.current?.laneId === "string" && over.data.current.laneId) ||
          lanes.get(overId);

    if (!activeLane || !overLane) {
      return;
    }

    if (activeLane !== overLane) {
      assignToDroppable(activeId, overLane);
      return;
    }

    if (overId === activeId || overId === activeLane) {
      return;
    }

    const currentIds = recordingIdsInLane(activeLane, unassigned, games);
    const oldIndex = currentIds.indexOf(activeId);
    const newIndex = currentIds.indexOf(overId);
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
      return;
    }
    onReorderLane?.(activeLane, arrayMove(currentIds, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={organizeCollisionDetection}
      onDragEnd={handleDragEnd}
    >
      <div
        data-slot="game-recording-board"
        className="grid min-w-0 gap-6 overflow-x-clip bg-background text-foreground lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]"
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
                    <CardHeader className="flex-wrap border-b border-border px-(--card-spacing) py-2">
                      <CardTitle className="min-w-0 text-sm">Game {game.gameNumber}</CardTitle>
                      {onRemoveGame ? (
                        <CardAction>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onRemoveGame(game.id)}
                          >
                            Remove game
                          </Button>
                        </CardAction>
                      ) : null}
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
