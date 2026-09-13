import type { CameraSide } from "@fe-template/mocks";

export type SessionImportRecording = {
  id: string;
  originalFilename: string;
  mimeType: string | null;
  sizeBytes: number | null;
  localLastModifiedAt: string | null;
  gameId: string | null;
  cameraSide: CameraSide;
};

export type SessionImportGame = {
  id: string;
  gameNumber: number | null;
};

export type SessionImportProps = {
  sessionId: string;
  recordings: SessionImportRecording[];
  games: SessionImportGame[];
};
