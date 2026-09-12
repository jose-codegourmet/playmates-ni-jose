# Package: `@fe-template/mocks`

- **Workspace name**: `@fe-template/mocks`
- **Package name**: `@fe-template/mocks`
- **Version**: `0.0.1`

## Purpose

In-memory Playmates data layer that looks like the future Prisma layer. Apps import from this package so UI and Server Actions do not talk to Prisma during the prototype.

## Problems it solves

- Gives web and admin a single import path for prototype data.
- Keeps the Prisma schema in `packages/db` untouched (still PawPair).
- Re-exports `PlaymatesComponentMeta` so apps can import catalogue types from either `@fe-template/mocks` or `@fe-template/config`.

## Intended consumers

- `apps/web` — public RSC fetchers (later tickets).
- `apps/admin` — Server Actions (later tickets).

## Public entry points

| Entry | Path | Exports |
|---|---|---|
| `.` | `src/index.ts` | `PlaymatesComponentMeta` (re-export). Domain types from `src/types.ts` (PNJ-012). `createSeedState` / `assertSeedInvariants` / `MockState` from `src/seed.ts` (PNJ-013). Async repository interfaces and `ImportFileMeta` from `src/repositories/types.ts` (PNJ-014). In-memory `getPlaymatesRepos`, `getState`, and `resetState` (PNJ-015). Naming / slug / title / Facebook body helpers from `src/naming.ts` (PNJ-016). Time-based upload simulator (`getJobView`, `simulatedDurationMs`) and `MockDomainError` / `ASSET_EXISTS` (PNJ-017). Public-site accessors from `src/public.ts` (PNJ-018): `listPublicSessions`, `getPublicSession`, `getPublicGame`, `listPublicPlayers`, `getPublicPlayer`, `listPublicVenues`, `getPublicVenue`. |

## Major dependencies

| Dependency | Purpose |
|---|---|
| `@fe-template/config` | Canonical `PlaymatesComponentMeta` type |

## Basic usage

```ts
import { getPlaymatesRepos, resetState } from "@fe-template/mocks";

const repos = getPlaymatesRepos();
const players = await repos.players.list();
resetState();
```

## How to swap the adapter later

Keep repository **interfaces** and app call sites. Replace **implementations**.

1. Implement `PlaymatesRepos` against Prisma in `packages/db` (owner work; see [`ROADMAP/11-handoff-to-real-data.md`](../../../ROADMAP/11-handoff-to-real-data.md)).
2. Point `apps/*/src/lib/playmates.ts` (PNJ-018) at `getPlaymatesRepos` from `@fe-template/db` instead of this package.
3. Delete in-memory store / seed files (and any later `store.json` helper) once Postgres is the source of truth.

Do not scatter `prisma.session.findMany` across pages. The seam is `getPlaymatesRepos()`.

## Replacing memory with Prisma

Owner work — not for prototype tickets. Follow [`ROADMAP/11-handoff-to-real-data.md`](../../../ROADMAP/11-handoff-to-real-data.md).

Keep `PlaymatesRepos` and the public helpers (`listPublicSessions`, `getPublicSession`, …). Reimplement `getPlaymatesRepos()` against Prisma (suggested `packages/db/src/prisma-repos.ts`) and change `apps/web/src/lib/playmates.ts` and `apps/admin/src/lib/playmates.ts` to import that function from `@fe-template/db`. Delete `packages/mocks/src/memory/*` (or keep as a test double) and any later `store.json` persistence. Do not call Prisma from pages.

## Fake upload simulator (PNJ-017)

`src/upload-simulator.ts` advances jobs from `startedAt` + elapsed time. There is **no** `setInterval`. Repo methods call `applyUploadSimulation()` so a refetch after ~6s can complete Drive and YouTube independently.

- `enqueue(recordingId, provider)` returns an active job for that pair; throws `MockDomainError` with `code: "ASSET_EXISTS"` when a completed job **and** `ProviderAsset` already exist. Actions will later require `replace: true`.
- Duration is 2500–6000 ms from `sizeBytes`. After the upload window, the job sits in `processing` for 400 ms, then completes and writes a `ProviderAsset`. YouTube `embedUrl` is `https://www.youtube.com/embed/MOCK{8hex}`.
- Force-fail: `originalFilename` contains `FAIL`, or `notes === "force-fail-youtube"` on the **youtube** provider. Seed includes one such recording on the **draft** session only (`SEED_IDS.recordings.draftForceFailYoutube`).
- `retry` is allowed from `failed|cancelled` only; increments `attemptCount` and clears errors. Providers are independent — retrying YouTube does not reset Drive.
- `cancel` is allowed from `queued|initiating|uploading`.

The simulator **does not read `File` bytes**. Do not add a server-side `sourceHandlePresent` map. Admin import UI keeps `File` objects in React state; after refresh that handle is gone. Prototype upload actions still run the simulator, but the UI must show a reselect banner (PNJ-063 / PNJ-072).

`packages/db` Prisma schema stays PawPair until the owner migrates it. This package must not start that migration.

## Development commands

| Script | Command | Purpose |
|---|---|---|
| `typecheck` | `pnpm --filter @fe-template/mocks typecheck` | TypeScript check |

## Local agent instructions

See `packages/mocks/AGENTS.md`.
