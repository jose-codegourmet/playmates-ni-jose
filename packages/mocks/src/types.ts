/**
 * Playmates domain types for the in-memory mock layer.
 * Field names are camelCase 1:1 with `docs/03-data/database-schema.md`.
 * IDs are uuid strings. Timestamps are ISO-8601 strings (RSC-serializable).
 */

/** Calendar date on a session (`sessions.session_date`), `YYYY-MM-DD`. */
export type SessionDate = string;

export type SessionStatus =
  | "draft"
  | "organizing"
  | "uploading"
  | "ready"
  | "published"
  | "archived";

/** Game publication status (`docs/07-engineering/state-machines.md`). */
export type GameStatus = "draft" | "ready" | "published" | "archived";

export type Visibility = "private" | "public";

export type CameraSide = "A" | "B" | "UNASSIGNED";

export type RecordingStatus =
  | "imported"
  | "organized"
  | "ready"
  | "uploading"
  | "uploaded"
  | "published"
  | "failed"
  | "archived";

export type UploadJobStatus =
  | "queued"
  | "initiating"
  | "uploading"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type Provider = "google_drive" | "youtube";

export type PostPlatform = "facebook_group";

export type ProviderAssetStatus = "created";

export interface Profile {
  id: string;
  displayName: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  displayName: string;
  slug: string | null;
  nickname: string | null;
  facebookName: string | null;
  facebookUrl: string | null;
  notes: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string | null;
  address: string | null;
  notes: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Court {
  id: string;
  venueId: string;
  name: string;
  sortOrder: number;
  isArchived: boolean;
}

export interface Session {
  id: string;
  sessionDate: SessionDate;
  title: string | null;
  slug: string | null;
  venueId: string | null;
  courtId: string | null;
  notes: string | null;
  status: SessionStatus;
  visibility: Visibility;
  driveFolderId: string | null;
  driveFolderUrl: string | null;
  createdBy: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionPlayer {
  sessionId: string;
  playerId: string;
}

export interface Game {
  id: string;
  sessionId: string;
  gameNumber: number | null;
  sortOrder: number;
  title: string | null;
  notes: string | null;
  status: GameStatus;
  visibility: Visibility;
  winnerTeamNo: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GameTeam {
  id: string;
  gameId: string;
  teamNo: number;
  label: string | null;
}

export interface GameTeamPlayer {
  gameTeamId: string;
  playerId: string;
  sortOrder: number;
}

export interface Recording {
  id: string;
  sessionId: string;
  gameId: string | null;
  originalFilename: string;
  displayName: string | null;
  cameraSide: CameraSide;
  partNumber: number;
  sortOrder: number;
  mimeType: string | null;
  sizeBytes: number | null;
  durationSeconds: number | null;
  capturedAt: string | null;
  localLastModifiedAt: string | null;
  checksum: string | null;
  notes: string | null;
  status: RecordingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderAsset {
  id: string;
  recordingId: string;
  provider: Provider;
  providerAssetId: string;
  providerParentId: string | null;
  url: string | null;
  embedUrl: string | null;
  privacy: string | null;
  title: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  status: ProviderAssetStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadJob {
  id: string;
  recordingId: string;
  provider: Provider;
  status: UploadJobStatus;
  progressPercent: number | null;
  bytesUploaded: number | null;
  totalBytes: number | null;
  attemptCount: number;
  resumableSessionRef: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostDraft {
  id: string;
  gameId: string;
  platform: PostPlatform;
  title: string | null;
  body: string;
  version: number;
  /** Set when José marks the draft posted (manual; no Facebook API). */
  postedAt?: string;
  postedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** In-memory app settings bag (PNJ-059). Used by Facebook body generation. */
export interface PlaymatesSettings {
  facebookGroupUrl: string;
  defaultHashtags: string;
}

/** Stub only — unused in the prototype. Never store plaintext tokens. */
export interface OauthConnection {
  id: string;
  profileId: string;
  provider: Provider;
  providerAccountId: string | null;
  email: string | null;
  scopes: string | null;
  tokenRef: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionListItem {
  date: SessionDate;
  title: string | null;
  slug: string | null;
  venueName: string | null;
  gameCount: number;
  playerNames: string[];
  visibility: Visibility;
  status: SessionStatus;
}

export interface GameListItem {
  gameNumber: number | null;
  matchupLabel: string;
  recordingCount: number;
  youtubeReady: boolean;
  driveReady: boolean;
  slug: string | null;
}

export interface RecordingView {
  displayName: string | null;
  side: CameraSide;
  part: number;
  filename: string;
  youtubeJobStatus: UploadJobStatus | null;
  driveJobStatus: UploadJobStatus | null;
}

export interface GameTeamWithPlayers extends GameTeam {
  players: Player[];
}

export interface GameWithTeamsAndRecordings extends Game {
  teams: GameTeamWithPlayers[];
  recordings: Recording[];
}

export interface SessionDetail {
  session: Session;
  venue: Venue | null;
  court: Court | null;
  players: Player[];
  games: GameWithTeamsAndRecordings[];
}
