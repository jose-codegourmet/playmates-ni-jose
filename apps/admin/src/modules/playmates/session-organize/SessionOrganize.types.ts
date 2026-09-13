import type { CameraSide } from "@fe-template/mocks";

export type SessionOrganizeRecording = {
  id: string;
  originalFilename: string;
  displayName: string | null;
  sizeBytes: number | null;
  durationSeconds: number | null;
  cameraSide: CameraSide;
  partNumber: number;
  sortOrder: number;
  gameId: string | null;
};

export type SessionOrganizeGame = {
  id: string;
  gameNumber: number | null;
  sortOrder: number;
};

export type SessionOrganizeProps = {
  recordings: SessionOrganizeRecording[];
  games: SessionOrganizeGame[];
};
