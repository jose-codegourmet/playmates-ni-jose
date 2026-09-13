import type { UploadJobStatus, Visibility } from "@fe-template/mocks";

export type SessionPublishChecklistGame = {
  id: string;
  gameNumber: number;
  matchup: string;
  youtubeStatus: UploadJobStatus | null;
  driveStatus: UploadJobStatus | null;
  visibility: Visibility;
};

export type SessionPublishChecklistProps = {
  games: SessionPublishChecklistGame[];
  onPublishGame: (gameId: string) => void;
  onUnpublishGame?: (gameId: string) => void;
  onPublishAll: () => void;
};
