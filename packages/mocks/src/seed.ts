/**
 * Hardcoded Sep 9 2026 MVP seed (PNJ-013).
 * Pure: no Date.now(), I/O, or random IDs.
 */

import type {
  Court,
  Game,
  GameTeam,
  GameTeamPlayer,
  OauthConnection,
  Player,
  PostDraft,
  Profile,
  ProviderAsset,
  Recording,
  Session,
  SessionPlayer,
  UploadJob,
  Venue,
} from "./types";

const T0 = "2026-08-01T10:00:00.000Z";
const T_AUG26 = "2026-08-26T13:00:00.000Z";
const T_SEP02 = "2026-09-02T12:00:00.000Z";
const T_SEP09 = "2026-09-09T12:30:00.000Z";
const T_SEP09_PUBLISHED = "2026-09-10T02:00:00.000Z";

/** Stable seed identifiers (uuid v4-shaped). */
export const SEED_IDS = {
  profileJose: "11111111-1111-4111-8111-111111111111",
  players: {
    jose: "aaaaaaaa-0001-4000-8000-000000000001",
    carlo: "aaaaaaaa-0001-4000-8000-000000000002",
    mika: "aaaaaaaa-0001-4000-8000-000000000003",
    marco: "aaaaaaaa-0001-4000-8000-000000000004",
    ana: "aaaaaaaa-0001-4000-8000-000000000005",
    luis: "aaaaaaaa-0001-4000-8000-000000000006",
    bea: "aaaaaaaa-0001-4000-8000-000000000007",
    nico: "aaaaaaaa-0001-4000-8000-000000000008",
  },
  venues: {
    smashCourtQc: "bbbbbbbb-0002-4000-8000-000000000001",
    greenShuttlePasig: "bbbbbbbb-0002-4000-8000-000000000002",
  },
  courts: {
    smash1: "cccccccc-0003-4000-8000-000000000001",
    smash2: "cccccccc-0003-4000-8000-000000000002",
    green1: "cccccccc-0003-4000-8000-000000000003",
  },
  sessions: {
    sep9: "dddddddd-0004-4000-8000-000000000001",
    draftSep2: "dddddddd-0004-4000-8000-000000000002",
    aug26: "dddddddd-0004-4000-8000-000000000003",
  },
  recordings: {
    /** Draft-session only; YouTube force-fail hook (PNJ-017). Not on Sep 9. */
    draftForceFailYoutube: "12121212-0017-4000-8000-000000000001",
  },
} as const;

export interface MockState {
  profiles: Profile[];
  players: Player[];
  venues: Venue[];
  courts: Court[];
  sessions: Session[];
  sessionPlayers: SessionPlayer[];
  games: Game[];
  gameTeams: GameTeam[];
  gameTeamPlayers: GameTeamPlayer[];
  recordings: Recording[];
  providerAssets: ProviderAsset[];
  uploadJobs: UploadJob[];
  postDrafts: PostDraft[];
  oauthConnections: OauthConnection[];
}

function player(id: string, displayName: string, slug: string, extras?: Partial<Player>): Player {
  return {
    id,
    displayName,
    slug,
    nickname: extras?.nickname ?? null,
    facebookName: extras?.facebookName ?? null,
    facebookUrl: extras?.facebookUrl ?? null,
    notes: extras?.notes ?? null,
    isArchived: false,
    createdAt: T0,
    updatedAt: T0,
  };
}

function uid(prefix: string, n: number): string {
  const hex = n.toString(16).padStart(12, "0");
  return `${prefix}-4000-8000-${hex}`;
}

function recordingDisplayName(
  gameNumber: number,
  side: "A" | "B",
  partNumber: number,
  partCount: number,
): string {
  const base = `Game ${gameNumber} - Side ${side}`;
  return partCount > 1 ? `${base} - Part ${partNumber}` : base;
}

type SideSpec = { side: "A" | "B"; partNumber: number; partCount: number };

function recordingLayout(gameNumber: number): SideSpec[] {
  if (gameNumber === 4) {
    return [
      { side: "A", partNumber: 1, partCount: 1 },
      { side: "B", partNumber: 1, partCount: 2 },
      { side: "B", partNumber: 2, partCount: 2 },
    ];
  }
  if (gameNumber === 8) {
    return [{ side: "A", partNumber: 1, partCount: 1 }];
  }
  // Roadmap table is 20 files (8×2 + 3 + 1); acceptance requires 21.
  // Extra Side B part on Game 10 fills the count without changing Game 4/8.
  if (gameNumber === 10) {
    return [
      { side: "A", partNumber: 1, partCount: 1 },
      { side: "B", partNumber: 1, partCount: 2 },
      { side: "B", partNumber: 2, partCount: 2 },
    ];
  }
  return [
    { side: "A", partNumber: 1, partCount: 1 },
    { side: "B", partNumber: 1, partCount: 1 },
  ];
}

/** Rotate doubles so every Sep 9 game has four roster players. */
function doublesForGame(gameNumber: number, roster: string[]): [string, string, string, string] {
  const start = ((gameNumber - 1) * 2) % roster.length;
  return [
    roster[start] as string,
    roster[(start + 1) % roster.length] as string,
    roster[(start + 2) % roster.length] as string,
    roster[(start + 3) % roster.length] as string,
  ];
}

export function createSeedState(): MockState {
  const p = SEED_IDS.players;
  const rosterIds = [p.jose, p.carlo, p.mika, p.marco, p.ana, p.luis, p.bea, p.nico];

  const profiles: Profile[] = [
    {
      id: SEED_IDS.profileJose,
      displayName: "José",
      role: "admin",
      createdAt: T0,
      updatedAt: T0,
    },
  ];

  const players: Player[] = [
    player(p.jose, "José", "jose", {
      nickname: "José",
      facebookName: "José Playmates",
      facebookUrl: "https://example.com/facebook/jose",
    }),
    player(p.carlo, "Carlo", "carlo"),
    player(p.mika, "Mika", "mika"),
    player(p.marco, "Marco", "marco"),
    player(p.ana, "Ana", "ana"),
    player(p.luis, "Luis", "luis"),
    player(p.bea, "Bea", "bea"),
    player(p.nico, "Nico", "nico"),
  ];

  const venues: Venue[] = [
    {
      id: SEED_IDS.venues.smashCourtQc,
      name: "Smash Court QC",
      slug: "smash-court-qc",
      address: "Quezon City",
      notes: null,
      isArchived: false,
      createdAt: T0,
      updatedAt: T0,
    },
    {
      id: SEED_IDS.venues.greenShuttlePasig,
      name: "Green Shuttle Pasig",
      slug: "green-shuttle-pasig",
      address: "Pasig",
      notes: null,
      isArchived: false,
      createdAt: T0,
      updatedAt: T0,
    },
  ];

  const courts: Court[] = [
    {
      id: SEED_IDS.courts.smash1,
      venueId: SEED_IDS.venues.smashCourtQc,
      name: "Court 1",
      sortOrder: 1,
      isArchived: false,
    },
    {
      id: SEED_IDS.courts.smash2,
      venueId: SEED_IDS.venues.smashCourtQc,
      name: "Court 2",
      sortOrder: 2,
      isArchived: false,
    },
    {
      id: SEED_IDS.courts.green1,
      venueId: SEED_IDS.venues.greenShuttlePasig,
      name: "Court 1",
      sortOrder: 1,
      isArchived: false,
    },
  ];

  const sessions: Session[] = [
    {
      id: SEED_IDS.sessions.sep9,
      sessionDate: "2026-09-09",
      title: "Wednesday night",
      slug: "2026-09-09",
      venueId: SEED_IDS.venues.smashCourtQc,
      courtId: SEED_IDS.courts.smash1,
      notes: null,
      status: "published",
      visibility: "public",
      driveFolderId: "drive-folder-2026-09-09",
      driveFolderUrl: "https://example.com/drive/folder/2026-09-09",
      createdBy: SEED_IDS.profileJose,
      publishedAt: T_SEP09_PUBLISHED,
      createdAt: T_SEP09,
      updatedAt: T_SEP09_PUBLISHED,
    },
    {
      id: SEED_IDS.sessions.draftSep2,
      sessionDate: "2026-09-02",
      title: "Draft night",
      slug: "2026-09-02",
      venueId: SEED_IDS.venues.smashCourtQc,
      courtId: SEED_IDS.courts.smash2,
      notes: "Private draft — hidden from public filters.",
      status: "draft",
      visibility: "private",
      driveFolderId: null,
      driveFolderUrl: null,
      createdBy: SEED_IDS.profileJose,
      publishedAt: null,
      createdAt: T_SEP02,
      updatedAt: T_SEP02,
    },
    {
      id: SEED_IDS.sessions.aug26,
      sessionDate: "2026-08-26",
      title: "Wednesday night",
      slug: "2026-08-26",
      venueId: SEED_IDS.venues.greenShuttlePasig,
      courtId: SEED_IDS.courts.green1,
      notes: null,
      status: "published",
      visibility: "public",
      driveFolderId: "drive-folder-2026-08-26",
      driveFolderUrl: "https://example.com/drive/folder/2026-08-26",
      createdBy: SEED_IDS.profileJose,
      publishedAt: T_AUG26,
      createdAt: T_AUG26,
      updatedAt: T_AUG26,
    },
  ];

  const sessionPlayers: SessionPlayer[] = rosterIds.map((playerId) => ({
    sessionId: SEED_IDS.sessions.sep9,
    playerId,
  }));

  const games: Game[] = [];
  const gameTeams: GameTeam[] = [];
  const gameTeamPlayers: GameTeamPlayer[] = [];
  const recordings: Recording[] = [];
  const providerAssets: ProviderAsset[] = [];
  const postDrafts: PostDraft[] = [];

  let filenameSeq = 1001;
  let recSort = 0;
  /** Game 1 Side A has Drive only — publish-warning case. Game 8 always has both. */
  const noYoutubeRecordingKey = "1-A-1";

  for (let gameNumber = 1; gameNumber <= 10; gameNumber += 1) {
    const gameId = uid("eeeeeeee-0005", gameNumber);
    games.push({
      id: gameId,
      sessionId: SEED_IDS.sessions.sep9,
      gameNumber,
      sortOrder: gameNumber,
      title: null,
      notes: null,
      status: "published",
      visibility: "public",
      winnerTeamNo: null,
      publishedAt: T_SEP09_PUBLISHED,
      createdAt: T_SEP09,
      updatedAt: T_SEP09_PUBLISHED,
    });

    const [a1, a2, b1, b2] = doublesForGame(gameNumber, rosterIds);
    const team1Id = uid("ffffffff-0006", gameNumber * 2 - 1);
    const team2Id = uid("ffffffff-0006", gameNumber * 2);
    gameTeams.push(
      { id: team1Id, gameId, teamNo: 1, label: null },
      { id: team2Id, gameId, teamNo: 2, label: null },
    );
    gameTeamPlayers.push(
      { gameTeamId: team1Id, playerId: a1, sortOrder: 0 },
      { gameTeamId: team1Id, playerId: a2, sortOrder: 1 },
      { gameTeamId: team2Id, playerId: b1, sortOrder: 0 },
      { gameTeamId: team2Id, playerId: b2, sortOrder: 1 },
    );

    const nameById = Object.fromEntries(players.map((pl) => [pl.id, pl.displayName]));
    const matchup = `${nameById[a1]} & ${nameById[a2]} vs ${nameById[b1]} & ${nameById[b2]}`;

    postDrafts.push({
      id: uid("99999999-0009", gameNumber),
      gameId,
      platform: "facebook_group",
      title: `Sep 9, 2026 | Game ${gameNumber}`,
      body: `Game ${gameNumber}\n${matchup}\n#PlaymatesNiJose #Badminton`,
      version: 1,
      createdAt: T_SEP09_PUBLISHED,
      updatedAt: T_SEP09_PUBLISHED,
    });

    for (const spec of recordingLayout(gameNumber)) {
      const recordingId = uid("12121212-0007", filenameSeq);
      const originalFilename = `IMG_${filenameSeq}.MOV`;
      recordings.push({
        id: recordingId,
        sessionId: SEED_IDS.sessions.sep9,
        gameId,
        originalFilename,
        displayName: recordingDisplayName(gameNumber, spec.side, spec.partNumber, spec.partCount),
        cameraSide: spec.side,
        partNumber: spec.partNumber,
        sortOrder: recSort,
        mimeType: "video/quicktime",
        sizeBytes: 80_000_000 + filenameSeq * 1000,
        durationSeconds: spec.partCount > 1 ? 540 : 1080,
        capturedAt: T_SEP09,
        localLastModifiedAt: T_SEP09,
        checksum: null,
        notes: null,
        status: "published",
        createdAt: T_SEP09,
        updatedAt: T_SEP09_PUBLISHED,
      });

      const ytId = `yt-g${gameNumber}-${spec.side}-p${spec.partNumber}`;
      const driveId = `drv-g${gameNumber}-${spec.side}-p${spec.partNumber}`;
      const key = `${gameNumber}-${spec.side}-${spec.partNumber}`;

      providerAssets.push({
        id: uid("13131313-0008", filenameSeq * 2),
        recordingId,
        provider: "google_drive",
        providerAssetId: driveId,
        providerParentId: "drive-folder-2026-09-09",
        url: `https://example.com/drive/${driveId}`,
        embedUrl: null,
        privacy: "unlisted",
        title: originalFilename,
        description: null,
        metadata: {},
        status: "created",
        publishedAt: T_SEP09_PUBLISHED,
        createdAt: T_SEP09_PUBLISHED,
        updatedAt: T_SEP09_PUBLISHED,
      });

      if (key !== noYoutubeRecordingKey) {
        providerAssets.push({
          id: uid("13131313-0008", filenameSeq * 2 + 1),
          recordingId,
          provider: "youtube",
          providerAssetId: ytId,
          providerParentId: null,
          url: `https://example.com/yt/${ytId}`,
          embedUrl: `https://example.com/yt/${ytId}/embed`,
          privacy: "unlisted",
          title: `Sep 9, 2026 | Game ${gameNumber} | ${matchup} | Side ${spec.side}`,
          description: null,
          metadata: {},
          status: "created",
          publishedAt: T_SEP09_PUBLISHED,
          createdAt: T_SEP09_PUBLISHED,
          updatedAt: T_SEP09_PUBLISHED,
        });
      }

      filenameSeq += 1;
      recSort += 1;
    }
  }

  for (let gameNumber = 1; gameNumber <= 2; gameNumber += 1) {
    const gameId = uid("eeeeeeee-0015", gameNumber);
    games.push({
      id: gameId,
      sessionId: SEED_IDS.sessions.aug26,
      gameNumber,
      sortOrder: gameNumber,
      title: null,
      notes: null,
      status: "published",
      visibility: "public",
      winnerTeamNo: null,
      publishedAt: T_AUG26,
      createdAt: T_AUG26,
      updatedAt: T_AUG26,
    });
    const [a1, a2, b1, b2] = doublesForGame(gameNumber, rosterIds);
    const team1Id = uid("ffffffff-0016", gameNumber * 2 - 1);
    const team2Id = uid("ffffffff-0016", gameNumber * 2);
    gameTeams.push(
      { id: team1Id, gameId, teamNo: 1, label: null },
      { id: team2Id, gameId, teamNo: 2, label: null },
    );
    gameTeamPlayers.push(
      { gameTeamId: team1Id, playerId: a1, sortOrder: 0 },
      { gameTeamId: team1Id, playerId: a2, sortOrder: 1 },
      { gameTeamId: team2Id, playerId: b1, sortOrder: 0 },
      { gameTeamId: team2Id, playerId: b2, sortOrder: 1 },
    );
    sessionPlayers.push({
      sessionId: SEED_IDS.sessions.aug26,
      playerId: a1,
    });
  }

  recordings.push({
    id: SEED_IDS.recordings.draftForceFailYoutube,
    sessionId: SEED_IDS.sessions.draftSep2,
    gameId: null,
    originalFilename: "IMG_2099.MOV",
    displayName: "Draft force-fail YouTube",
    cameraSide: "UNASSIGNED",
    partNumber: 1,
    sortOrder: 0,
    mimeType: "video/quicktime",
    sizeBytes: 42_000_000,
    durationSeconds: 180,
    capturedAt: T_SEP02,
    localLastModifiedAt: T_SEP02,
    checksum: null,
    notes: "force-fail-youtube",
    status: "imported",
    createdAt: T_SEP02,
    updatedAt: T_SEP02,
  });

  const uniqueAugPlayers = new Set(
    sessionPlayers
      .filter((sp) => sp.sessionId === SEED_IDS.sessions.aug26)
      .map((sp) => sp.playerId),
  );
  for (const playerId of rosterIds.slice(0, 4)) {
    if (!uniqueAugPlayers.has(playerId)) {
      sessionPlayers.push({ sessionId: SEED_IDS.sessions.aug26, playerId });
    }
  }

  return {
    profiles,
    players,
    venues,
    courts,
    sessions,
    sessionPlayers,
    games,
    gameTeams,
    gameTeamPlayers,
    recordings,
    providerAssets,
    uploadJobs: [],
    postDrafts,
    oauthConnections: [],
  };
}

function fail(message: string): never {
  throw new Error(`Seed invariant failed: ${message}`);
}

/** Throws if the Sep 9 MVP seed does not match PNJ-013 acceptance. */
export function assertSeedInvariants(state: MockState): void {
  const sep9 = state.sessions.find((s) => s.id === SEED_IDS.sessions.sep9);
  if (!sep9) fail("missing Sep 9 session");
  if (sep9.sessionDate !== "2026-09-09") fail("Sep 9 session_date");
  if (sep9.slug !== "2026-09-09") fail("Sep 9 slug");
  if (sep9.status !== "published") fail("Sep 9 status");
  if (sep9.visibility !== "public") fail("Sep 9 visibility");
  if (sep9.venueId !== SEED_IDS.venues.smashCourtQc) fail("Sep 9 venue");

  const draft = state.sessions.find((s) => s.id === SEED_IDS.sessions.draftSep2);
  if (!draft) fail("missing draft session");
  if (draft.status !== "draft") fail("draft status");
  if (draft.visibility !== "private") fail("draft visibility must be private");

  const draftForceFail = state.recordings.find(
    (r) => r.id === SEED_IDS.recordings.draftForceFailYoutube,
  );
  if (!draftForceFail) fail("missing draft force-fail recording (PNJ-017)");
  if (draftForceFail.sessionId !== draft.id) fail("force-fail recording must be on draft session");
  if (draftForceFail.notes !== "force-fail-youtube") fail("force-fail notes");
  const sep9ForceFail = state.recordings.some(
    (r) =>
      r.sessionId === sep9.id &&
      (r.notes === "force-fail-youtube" || r.originalFilename.includes("FAIL")),
  );
  if (sep9ForceFail) fail("Sep 9 must not include force-fail recordings");

  const sep9Recordings = state.recordings.filter((r) => r.sessionId === sep9.id);
  if (sep9Recordings.length !== 21) {
    fail(`Sep 9 recordings === 21 (got ${sep9Recordings.length})`);
  }

  const sep9Games = state.games
    .filter((g) => g.sessionId === sep9.id)
    .sort((a, b) => (a.gameNumber ?? 0) - (b.gameNumber ?? 0));
  if (sep9Games.length !== 10) fail(`Sep 9 games === 10 (got ${sep9Games.length})`);

  const game4 = sep9Games.find((g) => g.gameNumber === 4);
  const game8 = sep9Games.find((g) => g.gameNumber === 8);
  if (!game4 || !game8) fail("missing game 4 or 8");

  const g4b = state.recordings.filter((r) => r.gameId === game4.id && r.cameraSide === "B");
  if (g4b.length !== 2) fail(`Game 4 Side B parts === 2 (got ${g4b.length})`);
  const parts = new Set(g4b.map((r) => r.partNumber));
  if (!parts.has(1) || !parts.has(2)) fail("Game 4 Side B must be parts 1 and 2");

  const g8 = state.recordings.filter((r) => r.gameId === game8.id);
  if (g8.length !== 1) fail(`Game 8 recordings === 1 (got ${g8.length})`);

  const g8Assets = state.providerAssets.filter((a) => a.recordingId === g8[0]?.id);
  const g8Providers = new Set(g8Assets.map((a) => a.provider));
  if (!g8Providers.has("youtube") || !g8Providers.has("google_drive")) {
    fail("Game 8 single recording must have YouTube and Drive");
  }

  const recordingsWithoutYt = sep9Recordings.filter(
    (r) => !state.providerAssets.some((a) => a.recordingId === r.id && a.provider === "youtube"),
  );
  if (recordingsWithoutYt.length !== 1) {
    fail(`exactly one Sep 9 recording without YouTube (got ${recordingsWithoutYt.length})`);
  }

  const sep9Posts = state.postDrafts.filter((d) => sep9Games.some((g) => g.id === d.gameId));
  if (sep9Posts.length !== 10) fail(`post_drafts for each Sep 9 game (got ${sep9Posts.length})`);

  for (const game of sep9Games) {
    const teams = state.gameTeams.filter((t) => t.gameId === game.id);
    if (teams.length !== 2) fail(`game ${game.gameNumber} must be doubles (2 teams)`);
    for (const team of teams) {
      const members = state.gameTeamPlayers.filter((m) => m.gameTeamId === team.id);
      if (members.length !== 2) fail(`game ${game.gameNumber} team ${team.teamNo} needs 2 players`);
    }
  }

  if (state.players.length < 8) fail("at least 8 players");
  if (state.venues.length < 2) fail("at least 2 venues");

  const smashCourts = state.courts.filter((c) => c.venueId === SEED_IDS.venues.smashCourtQc);
  const courtNames = new Set(smashCourts.map((c) => c.name));
  if (!courtNames.has("Court 1") || !courtNames.has("Court 2")) {
    fail("Smash Court QC must have Court 1 and Court 2");
  }

  const aug = state.sessions.find((s) => s.id === SEED_IDS.sessions.aug26);
  if (aug?.visibility !== "public") fail("tertiary public session");
  const augGames = state.games.filter((g) => g.sessionId === SEED_IDS.sessions.aug26);
  if (augGames.length !== 2) fail("tertiary session must have 2 games");
}
