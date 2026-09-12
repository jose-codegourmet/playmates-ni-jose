import { Card, CardContent, CardHeader, Empty, EmptyHeader, EmptyTitle } from "@fe-template/ui";

import { CameraSideLane } from "../camera-side-lane/CameraSideLane";
import { RecordingCard } from "../recording-card/RecordingCard";
import type { GameRecordingBoardProps } from "./GameRecordingBoard.types";

function GameRecordingBoard({ unassigned, games }: GameRecordingBoardProps) {
  return (
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
        {unassigned.length === 0 ? (
          <Empty className="min-h-32 border border-dashed border-border bg-muted/30">
            <EmptyHeader>
              <EmptyTitle>No unassigned files</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-2">
            {unassigned.map((recording) => (
              <li key={recording.id}>
                <RecordingCard {...recording} />
              </li>
            ))}
          </ul>
        )}
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
                    <CameraSideLane side="A" recordings={game.sides.A} />
                    <CameraSideLane side="B" recordings={game.sides.B} />
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

export type { GameRecordingBoardProps };
export { GameRecordingBoard };
