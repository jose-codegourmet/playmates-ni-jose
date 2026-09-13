import type { SessionStatus, UploadJobStatus, Visibility } from "@fe-template/mocks";

export type SessionReviewPublishGame = {
  id: string;
  gameNumber: number;
  matchup: string;
  youtubeStatus: UploadJobStatus | null;
  driveStatus: UploadJobStatus | null;
  visibility: Visibility;
  facebookTitle: string;
  facebookBody: string;
};

export type SessionReviewPublishProps = {
  sessionId: string;
  sessionStatus: SessionStatus;
  sessionVisibility: Visibility;
  games: SessionReviewPublishGame[];
  onPublishGame?: (gameId: string) => Promise<void> | void;
  onPublishAll?: () => Promise<void> | void;
  onPublishSession?: () => Promise<void> | void;
  onUnpublishSession?: () => Promise<void> | void;
  onSetSessionVisibility?: (visibility: Visibility) => Promise<void> | void;
  onSetGameVisibility?: (gameId: string, visibility: Visibility) => Promise<void> | void;
};
