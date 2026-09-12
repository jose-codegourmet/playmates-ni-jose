# Phase 1 — `packages/mocks` data layer

Goal: a swappable in-memory backend that looks like the future Prisma layer. Admin Server Actions and web RSC fetchers call this package only.

**Do not** edit `packages/db` Prisma schema.

Read first: [`docs/03-data/database-schema.md`](../docs/03-data/database-schema.md), [`docs/01-product/naming-conventions.md`](../docs/01-product/naming-conventions.md), [`docs/07-engineering/state-machines.md`](../docs/07-engineering/state-machines.md), [`docs/08-implementation/mvp-acceptance-criteria.md`](../docs/08-implementation/mvp-acceptance-criteria.md).

---

### PNJ-011 — Create the `@fe-template/mocks` workspace

**Phase** 1 · **Depends on** PNJ-001 · **Size** S  
**Read first:** `pnpm-workspace.yaml` (already `packages/*`), `packages/config/package.json`, `packages/db/package.json`  
**Create:** `packages/mocks/` as specified  
**Edit:** `apps/web/package.json`, `apps/admin/package.json` to depend on `workspace:*`  
**Delete:** none  
**Do not touch:** `packages/db`

**Steps:**

1. Create:

   ```text
   packages/mocks/
     package.json          name: "@fe-template/mocks", private, type module
     tsconfig.json         extend repo/tsconfig patterns from packages/db
     src/index.ts          barrel
     AGENTS.md             scope: mock data only, no I/O
     docs/README.md        how to swap the adapter later
   ```

2. `package.json` scripts: `"typecheck": "tsc --noEmit"`. Export `"."` → `./src/index.ts`.

3. Add `"@fe-template/mocks": "workspace:*"` to web and admin dependencies.

4. Add `PlaymatesComponentMeta` type here **or** in `packages/config` (see [`02-metadata.md`](02-metadata.md)). If using config, give `@fe-template/config` a real `main`/`types` export. Pick one and export from `@fe-template/mocks` as `export type { PlaymatesComponentMeta } from "@fe-template/config"` if split.

5. `pnpm install` from repo root.

**Acceptance:** `pnpm --filter @fe-template/mocks typecheck` passes. Apps can `import {} from "@fe-template/mocks"`.

**Validate:** `pnpm --filter @fe-template/mocks typecheck`

---

### PNJ-012 — Domain types matching the documented schema

**Phase** 1 · **Depends on** PNJ-011 · **Size** M  
**Read first:** [`docs/03-data/database-schema.md`](../docs/03-data/database-schema.md)  
**Create:** `packages/mocks/src/types.ts` (or `src/types/*.ts` barrelled)  
**Edit:** `src/index.ts`  
**Delete:** none  
**Do not touch:** Prisma files  

**Steps:**

1. Define string-union types (plain strings, not TS enums that we later fight with Prisma):

   - `SessionStatus`: draft | organizing | uploading | ready | published | archived
   - `Visibility`: private | public
   - `CameraSide`: A | B | UNASSIGNED
   - `RecordingStatus`: imported | organized | ready | uploading | uploaded | published | failed | archived
   - `UploadJobStatus`: queued | initiating | uploading | processing | completed | failed | cancelled
   - `Provider`: google_drive | youtube
   - `PostPlatform`: facebook_group

2. Define interfaces with **camelCase** fields matching the SQL columns:

   `Profile`, `Player`, `Venue`, `Court`, `Session`, `SessionPlayer`, `Game`, `GameTeam`, `GameTeamPlayer`, `Recording`, `ProviderAsset`, `UploadJob`, `PostDraft`, `OauthConnection` (stub only — unused in prototype).

3. IDs: `string` (uuid). Dates: ISO `string` in the mock layer so everything is serializable across the RSC boundary. Also export `SessionDate` as `string` (`YYYY-MM-DD`).

4. Export **view types** used by UI:

   - `SessionListItem` — date, title, slug, venueName, gameCount, playerNames[], visibility, status
   - `GameListItem` — gameNumber, matchupLabel, recordingCount, youtubeReady, driveReady, slug
   - `RecordingView` — displayName, side, part, filename, job statuses
   - `SessionDetail` — session + venue + court + players + games[] each with teams and recordings

5. Do not add `player_1` columns. Do not add `youtubeUrl` on `Game`.

**Acceptance:** Types compile. A reviewer can map each interface 1:1 to the schema doc.

**Validate:** `pnpm --filter @fe-template/mocks typecheck`

---

### PNJ-013 — Seed data: Sep 9 2026 MVP scenario

**Phase** 1 · **Depends on** PNJ-012 · **Size** L  
**Read first:** [`docs/08-implementation/mvp-acceptance-criteria.md`](../docs/08-implementation/mvp-acceptance-criteria.md)  
**Create:** `packages/mocks/src/seed.ts`  
**Edit:** none  
**Delete:** none  
**Do not touch:** apps  

**Steps:**

1. Create **players** (stable UUIDs, slugs): José, Carlo, Mika, Marco, plus at least 4 more so filters look real (e.g. Ana, Luis, Bea, Nico). Facebook fields empty except José optional.

2. Create **venues**: at least 2. One named like “Smash Court QC” with courts “Court 1”, “Court 2”. One other venue.

3. Create **sessions**:
   - **Primary:** `session_date = 2026-09-09`, slug `2026-09-09`, status `published`, visibility `public`, venue = Smash Court, roster = all 8 players. Title optional `Wednesday night`.
   - **Secondary:** a `draft` / `private` session on `2026-09-02` so public filters can hide it.
   - **Tertiary:** another public session (e.g. `2026-08-26`) with 2 games so home “latest sessions” is not a single card.

4. On the Sep 9 session create **exactly 10 games**, `game_number` 1–10.

   Recording layout (21 files):

   | Game | Side A | Side B |
   |---|---|---|
   | 1–3, 5–7, 9–10 | 1 file | 1 file |
   | 4 | 1 file | **2 files** (parts 1 and 2) |
   | 8 | 1 file | **none** |

   Count: (8 games × 2) + (1×3) + (1×1) = 16 + 3 + 1 = **21**.

5. Filenames: `IMG_1xxx.MOV` style. `camera_side` and `part_number` already organized on the published session. `status = published` for those recordings.

6. For the published session, attach **provider assets** for most recordings (YouTube + Drive URLs as `https://example.com/yt/{id}` and `https://example.com/drive/{id}`). Leave **one** recording without YouTube so the publish warning UI has a case. Game 8’s single recording has both providers.

7. Assign matchups on all 10 games (doubles using the roster). Game 8 can be doubles too.

8. Generate `post_drafts` for each Sep 9 game with placeholder body.

9. Export `createSeedState(): MockState` — pure function, no Date.now except inside field values you hardcode.

**Acceptance:**

- `createSeedState().recordings.filter(r => r.sessionId === sep9).length === 21`
- Game 4 has two Side B parts.
- Game 8 has exactly one recording.
- Draft session has `visibility: "private"`.

**Validate:** add `packages/mocks/src/seed.test.ts` **only if** the repo already has vitest at package level. If not, export a `assertSeedInvariants()` used by PNJ-015 on store init (throw if invariants fail). Prefer the assert function to avoid new test infra.

---

### PNJ-014 — Repository interfaces

**Phase** 1 · **Depends on** PNJ-012 · **Size** M  
**Create:** `packages/mocks/src/repositories/types.ts`  
**Edit:** `src/index.ts`  
**Do not touch:** apps  

**Steps:**

Define async interfaces. Every method returns `Promise<...>`. This is the seam the owner will reimplement with Prisma.

```ts
export type PlayerRepository = {
  list(opts?: { includeArchived?: boolean }): Promise<Player[]>;
  getById(id: string): Promise<Player | null>;
  getBySlug(slug: string): Promise<Player | null>;
  create(input: { displayName: string; nickname?: string; facebookName?: string; facebookUrl?: string; notes?: string }): Promise<Player>;
  update(id: string, patch: Partial<Player>): Promise<Player>;
  archive(id: string): Promise<Player>;
};

export type VenueRepository = {
  list(): Promise<Venue[]>;
  getById(id: string): Promise<Venue | null>;
  getBySlug(slug: string): Promise<Venue | null>;
  create(input: { name: string; address?: string; notes?: string }): Promise<Venue>;
  update(id: string, patch: Partial<Venue>): Promise<Venue>;
  archive(id: string): Promise<Venue>;
  listCourts(venueId: string): Promise<Court[]>;
  addCourt(venueId: string, input: { name: string }): Promise<Court>;
};

export type SessionRepository = {
  list(opts?: { visibility?: Visibility }): Promise<SessionListItem[]>;
  getById(id: string): Promise<SessionDetail | null>;
  getBySlug(slug: string): Promise<SessionDetail | null>;
  create(input: { sessionDate: string; title?: string; venueId?: string; courtId?: string; notes?: string }): Promise<Session>;
  update(id: string, patch: Partial<Session>): Promise<Session>;
  setRoster(id: string, playerIds: string[]): Promise<void>;
};

export type GameRepository = {
  listBySession(sessionId: string): Promise<Game[]>;
  getById(id: string): Promise<Game | null>;
  getBySlug(slug: string): Promise<Game | null>;
  create(sessionId: string, input?: { gameNumber?: number }): Promise<Game>;
  reorder(sessionId: string, gameIds: string[]): Promise<void>;
  setTeams(gameId: string, teams: { teamNo: 1 | 2; playerIds: string[] }[]): Promise<void>;
  update(id: string, patch: Partial<Game>): Promise<Game>;
};

export type RecordingRepository = {
  listBySession(sessionId: string): Promise<Recording[]>;
  createMany(sessionId: string, files: ImportFileMeta[]): Promise<Recording[]>;
  assign(recordingId: string, patch: { gameId: string | null; cameraSide: CameraSide; partNumber?: number }): Promise<Recording>;
  normalizeParts(gameId: string, cameraSide: CameraSide): Promise<void>;
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
```

Add `ImportFileMeta`: `{ originalFilename, mimeType, sizeBytes, localLastModifiedAt }`.

Court-belongs-to-venue validation belongs in `sessions.create/update`, not the UI.

**Acceptance:** Interfaces exported. No implementations in this ticket except empty `NotImplemented` if needed — prefer implementations in PNJ-015.

**Validate:** typecheck package.

---

### PNJ-015 — In-memory store + repository implementations

**Phase** 1 · **Depends on** PNJ-013, PNJ-014 · **Size** XL  
**Create:**  
- `packages/mocks/src/store.ts` — `Map`s on a global singleton  
- `packages/mocks/src/memory/*.ts` — one file per repo  
- `packages/mocks/src/get-repos.ts` — `getPlaymatesRepos(): PlaymatesRepos`  
**Edit:** `src/index.ts`  
**Do not touch:** Prisma, Next cache beyond what actions will call later  

**Steps:**

1. `MockState` holds arrays or Maps for every entity. `createSeedState()` seeds it.

2. **Process singleton:**

   ```ts
   const g = globalThis as { __playmatesMock?: MockState };
   export function getState(): MockState {
     if (!g.__playmatesMock) g.__playmatesMock = createSeedState();
     return g.__playmatesMock();
   }
   export function resetState() { g.__playmatesMock = createSeedState(); }
   ```

   Fix the typo in implementation: assign `createSeedState()`, do not call the state as a function.

3. All writes mutate the singleton. `crypto.randomUUID()` for new ids. `updatedAt = new Date().toISOString()`.

4. `list({ visibility: "public" })` filters sessions **and** nested games to public only.

5. Slug uniqueness: if `2026-09-09` exists, next is `2026-09-09-2`.

6. `create` game: next `game_number` = max+1, create two empty teams.

7. `assign` recording: set fields then `normalizeParts` for the old and new (game, side) pairs.

8. `setTeams`: replace `game_team_players` for that game. Players SHOULD be on the session roster; if not, still allow (inline-create is a later action) but do not throw — admin inline add is PNJ-055/062.

9. Court validation: if `courtId` set, court.venueId === session.venueId.

10. Export `getPlaymatesRepos()` used by all Server Actions.

11. Call `assertSeedInvariants(getState())` on first init.

**Acceptance:**

- Two sequential `getPlaymatesRepos().players.create({ displayName: "Test" })` calls from the same process return two rows that `list()` includes.
- `resetState()` restores 21 Sep-9 recordings.

**Validate:** `pnpm --filter @fe-template/mocks typecheck`

---

### PNJ-016 — Naming, slug, title, Facebook body generators

**Phase** 1 · **Depends on** PNJ-012 · **Size** M  
**Read first:** [`docs/01-product/naming-conventions.md`](../docs/01-product/naming-conventions.md)  
**Create:** `packages/mocks/src/naming.ts`  
**Do not touch:** apps  

**Steps:**

Pure functions:

| Function | Default output |
|---|---|
| `formatSessionFolderName(date)` | `2026-09-09` |
| `formatSessionDisplayDate(date)` | `Sep 9, 2026` |
| `formatRecordingDisplayName({ gameNumber, side, partNumber, partCount })` | `Game 2 - Side B - Part 1` (omit “Part” when `partCount === 1`) |
| `formatDriveFilename({ date, gameNumber, side, partNumber, partCount, ext })` | `2026-09-09 - Game 02 - Side B - Part 02.mov` |
| `formatYoutubeTitle({ date, gameNumber, team1, team2, sideLabel })` | `Sep 9, 2026 \| Game 3 \| José & Carlo vs Mika & Marco \| Side A` |
| `formatMatchup(team1Names, team2Names)` | `José & Carlo vs Mika & Marco` or `Team 1 vs Team 2` |
| `slugify(text)` | lowercase, hyphens, strip accents |
| `formatGameSlug(sessionDate, gameNumber)` | `2026-09-09-game-3` |
| `formatFacebookBody({ ... })` | title line, players, YouTube links, Drive links, notes, `#PlaymatesNiJose #Badminton` |

Generators never throw on missing players.

**Acceptance:** Unit-less but export examples in a comment. `formatRecordingDisplayName` for game 1 side A part 1 of 1 has no “Part”. Game 4 side B part 2 of 2 includes “Part 2”.

**Validate:** typecheck.

---

### PNJ-017 — Fake upload simulator

**Phase** 1 · **Depends on** PNJ-015 · **Size** L  
**Read first:** [`docs/07-engineering/state-machines.md`](../docs/07-engineering/state-machines.md), [`docs/04-workflows/retry-and-recovery.md`](../docs/04-workflows/retry-and-recovery.md)  
**Create:** `packages/mocks/src/upload-simulator.ts`  
**Edit:** `UploadRepository` memory impl  

**Steps:**

1. `enqueue(recordingId, provider)`:
   - If an active job (`queued|initiating|uploading|processing`) exists for that pair, return it.
   - If a completed job + asset exists, throw a typed error `ASSET_EXISTS` (actions will require `replace: true`).
   - Else create job `queued`, `progressPercent: 0`.

2. Simulator ticks: use `setInterval` on the server **or** compute progress from `startedAt` + elapsed so Server Components can poll.

   Preferred for Next: **time-based**, no background interval (intervals die across serverless).  

   `getJobView(job)`: if status is uploading, `progress = min(99, elapsed / simulatedDuration * 100)`. When elapsed > duration → `processing` for 400ms equivalent then `completed`, create `ProviderAsset` with fake ids/urls.

3. `simulatedDuration` = 2500–6000 ms based on `sizeBytes` hash so 21 files don’t finish in one paint.

4. Force-fail hook for stories/acceptance: if `originalFilename` includes `FAIL` or `recording.notes === "force-fail-youtube"` and provider is youtube, complete as `failed` with `lastErrorCode = "MOCK_PROVIDER_ERROR"`. Seed **one** such optional recording on the draft session, not on Sep 9 public.

5. `retry`: only from `failed|cancelled`. Increment `attemptCount`. Clear error. Independent per provider.

6. `cancel`: from `queued|initiating|uploading`.

7. Completing YouTube writes `embed_url` like `https://www.youtube.com/embed/dQw4w9wg` (use a reserved mock id `MOCK{8hex}`).

8. Document: simulator does not read `File` bytes. A separate `sourceHandlePresent: boolean` on a **client-only** map is **not** in this package. Admin import UI tracks File objects in React state; after refresh, `sourceHandlePresent` is false and upload actions still run the simulator (prototype convenience) **but** the UI must show the reselect banner. Ticket PNJ-063/072 will wire the banner. Do not pretend the server has the file.

**Acceptance:**

- Enqueue Drive + YouTube on one recording → two jobs.
- After ~6s and a refetch, both can complete independently.
- Retry YouTube does not clone/reset Drive.

**Validate:** typecheck.

---

### PNJ-018 — App-facing accessors (no Prisma)

**Phase** 1 · **Depends on** PNJ-015, PNJ-016, PNJ-017 · **Size** S  
**Create:**  
- `packages/mocks/src/index.ts` complete barrel  
- `apps/admin/src/lib/playmates.ts` re-export `getPlaymatesRepos`  
- `apps/web/src/lib/playmates.ts` re-export public helpers  
**Edit:** none else  
**Do not touch:** Prisma  

**Steps:**

1. Web helper `listPublicSessions()`, `getPublicSession(slug)`, `getPublicGame(slug)`, `listPublicPlayers()`, `getPublicPlayer(slug)`, `listPublicVenues()`, `getPublicVenue(slug)` — each calls repos with `visibility: "public"` and returns null for private.

2. Admin uses `getPlaymatesRepos()` directly in Server Actions later. The thin `lib/playmates.ts` is only so apps don’t import deep paths.

3. Add `packages/mocks/docs/README.md` section “Replacing memory with Prisma” pointing at [`11-handoff-to-real-data.md`](11-handoff-to-real-data.md).

**Acceptance:** web and admin typecheck with a dummy import.

**Validate:** `pnpm --filter web typecheck && pnpm --filter admin typecheck && pnpm --filter @fe-template/mocks typecheck`
