import type { CameraSide, ProviderAsset, Recording } from "@fe-template/mocks";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@fe-template/ui";
import { cn } from "@/lib/utils";
import { YoutubeEmbed } from "@/sections/_shared/youtube-embed/YoutubeEmbed";

import type {
  GameDetailRecordingGroup,
  GameDetailRecordingItem,
  GameDetailRecordingsSectionProps,
} from "./GameDetailRecordingsSection.types";

const SIDE_ORDER: CameraSide[] = ["A", "B", "UNASSIGNED"];

function sideHeading(side: CameraSide): string {
  return side === "UNASSIGNED" ? "Unassigned" : `Side ${side}`;
}

function recordingLabel(side: CameraSide, partNumber: number): string {
  return `${sideHeading(side)} · Part ${partNumber}`;
}

export function toGameDetailRecordingGroups(
  recordings: Recording[],
  assets: ProviderAsset[],
): GameDetailRecordingGroup[] {
  const assetsByRecording = new Map<string, ProviderAsset[]>();
  for (const asset of assets) {
    const list = assetsByRecording.get(asset.recordingId) ?? [];
    list.push(asset);
    assetsByRecording.set(asset.recordingId, list);
  }

  const grouped = new Map<CameraSide, Recording[]>();
  for (const recording of recordings) {
    const list = grouped.get(recording.cameraSide) ?? [];
    list.push(recording);
    grouped.set(recording.cameraSide, list);
  }

  return SIDE_ORDER.flatMap((side) => {
    const sideRecordings = (grouped.get(side) ?? [])
      .slice()
      .sort((a, b) => a.partNumber - b.partNumber);
    if (sideRecordings.length === 0) {
      return [];
    }

    const heading = sideHeading(side);
    const items: GameDetailRecordingItem[] = sideRecordings.map((recording) => {
      const recAssets = assetsByRecording.get(recording.id) ?? [];
      const youtube = recAssets.find((asset) => asset.provider === "youtube" && asset.embedUrl);
      const drive = recAssets.find((asset) => asset.provider === "google_drive" && asset.url);
      const label = recordingLabel(side, recording.partNumber);
      return {
        id: recording.id,
        label,
        partNumber: recording.partNumber,
        filename: recording.originalFilename,
        embedUrl: youtube?.embedUrl ?? undefined,
        driveUrl: drive?.url ?? undefined,
        embedTitle: youtube?.title ?? recording.displayName ?? label,
      };
    });

    return [{ side, heading, recordings: items }];
  });
}

function GameDetailRecordingsSection({ className, groups }: GameDetailRecordingsSectionProps) {
  return (
    <section
      data-slot="game-detail-recordings-section"
      className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight">Recordings</h2>
      {groups.length === 0 ? (
        <Empty className="mt-6 border">
          <EmptyHeader>
            <EmptyTitle>No published recordings</EmptyTitle>
            <EmptyDescription>Recordings for this game will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.side} aria-labelledby={`game-recordings-${group.side}`}>
              <h3
                className="text-lg font-semibold tracking-tight"
                id={`game-recordings-${group.side}`}
              >
                {group.heading}
              </h3>
              <ol className="mt-4 flex list-none flex-col gap-6 p-0">
                {group.recordings.map((recording) => (
                  <li key={recording.id} className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{recording.label}</p>
                    <div className="mt-3">
                      {recording.embedUrl ? (
                        <YoutubeEmbed embedUrl={recording.embedUrl} title={recording.embedTitle} />
                      ) : (
                        <div className="rounded-lg border bg-muted/40 p-4">
                          <p className="text-sm text-foreground">{recording.filename}</p>
                          {recording.driveUrl ? (
                            <a
                              className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline"
                              href={recording.driveUrl}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              Open in Drive
                            </a>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

export type { GameDetailRecordingGroup, GameDetailRecordingItem, GameDetailRecordingsSectionProps };
export { GameDetailRecordingsSection };
