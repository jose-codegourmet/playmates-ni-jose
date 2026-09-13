import type {
  CameraSide,
  Court,
  Game,
  Player,
  PostDraft,
  Provider,
  Recording,
  Session,
  SessionDetail,
  SessionListItem,
  UploadJob,
  Venue,
  Visibility,
} from "../types";

/** Browser file metadata captured at import (no File bytes in this package). */
export type ImportFileMeta = {
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  localLastModifiedAt: string;
};

export type PlayerRepository = {
  list(opts?: { includeArchived?: boolean }): Promise<Player[]>;
  getById(id: string): Promise<Player | null>;
  getBySlug(slug: string): Promise<Player | null>;
  create(input: {
    displayName: string;
    nickname?: string;
    facebookName?: string;
    facebookUrl?: string;
    notes?: string;
  }): Promise<Player>;
  update(id: string, patch: Partial<Player>): Promise<Player>;
  archive(id: string): Promise<Player>;
};

export type VenueRepository = {
  list(opts?: { includeArchived?: boolean }): Promise<Venue[]>;
  getById(id: string): Promise<Venue | null>;
  getBySlug(slug: string): Promise<Venue | null>;
  create(input: { name: string; address?: string; notes?: string }): Promise<Venue>;
  update(id: string, patch: Partial<Venue>): Promise<Venue>;
  archive(id: string): Promise<Venue>;
  listCourts(venueId: string, opts?: { includeArchived?: boolean }): Promise<Court[]>;
  addCourt(venueId: string, input: { name: string }): Promise<Court>;
  archiveCourt(courtId: string): Promise<Court>;
};

export type SessionRepository = {
  list(opts?: { visibility?: Visibility }): Promise<SessionListItem[]>;
  getById(id: string): Promise<SessionDetail | null>;
  getBySlug(slug: string): Promise<SessionDetail | null>;
  create(input: {
    sessionDate: string;
    title?: string;
    venueId?: string;
    courtId?: string;
    notes?: string;
  }): Promise<Session>;
  update(id: string, patch: Partial<Session>): Promise<Session>;
  setRoster(id: string, playerIds: string[]): Promise<void>;
};

export type GameRepository = {
  listBySession(sessionId: string): Promise<Game[]>;
  getById(id: string): Promise<Game | null>;
  getBySlug(slug: string): Promise<Game | null>;
  create(sessionId: string, input?: { gameNumber?: number }): Promise<Game>;
  delete(id: string): Promise<void>;
  reorder(sessionId: string, gameIds: string[]): Promise<void>;
  setTeams(gameId: string, teams: { teamNo: 1 | 2; playerIds: string[] }[]): Promise<void>;
  update(id: string, patch: Partial<Game>): Promise<Game>;
};

export type RecordingRepository = {
  listBySession(sessionId: string): Promise<Recording[]>;
  createMany(sessionId: string, files: ImportFileMeta[]): Promise<Recording[]>;
  assign(
    recordingId: string,
    patch: { gameId: string | null; cameraSide: CameraSide; partNumber?: number },
  ): Promise<Recording>;
  normalizeParts(gameId: string, cameraSide: CameraSide): Promise<void>;
  reorderInLane(
    gameId: string | null,
    cameraSide: CameraSide,
    recordingIds: string[],
  ): Promise<void>;
  update(id: string, patch: Partial<Recording>): Promise<Recording>;
};

export type UploadRepository = {
  enqueue(recordingId: string, provider: Provider): Promise<UploadJob>;
  retry(jobId: string): Promise<UploadJob>;
  cancel(jobId: string): Promise<UploadJob>;
  listBySession(sessionId: string): Promise<UploadJob[]>;
};

export type PublishRepository = {
  publishSession(id: string): Promise<Session>;
  unpublishSession(id: string): Promise<Session>;
  publishGame(id: string): Promise<Game>;
  unpublishGame(id: string): Promise<Game>;
};

export type PostDraftRepository = {
  getByGame(gameId: string): Promise<PostDraft | null>;
  generate(gameId: string): Promise<PostDraft>;
  update(id: string, body: string): Promise<PostDraft>;
  markPosted(id: string, url?: string): Promise<PostDraft>;
};

export type PlaymatesRepos = {
  players: PlayerRepository;
  venues: VenueRepository;
  sessions: SessionRepository;
  games: GameRepository;
  recordings: RecordingRepository;
  uploads: UploadRepository;
  publish: PublishRepository;
  posts: PostDraftRepository;
};
