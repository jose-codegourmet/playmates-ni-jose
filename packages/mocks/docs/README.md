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
| `.` | `src/index.ts` | `PlaymatesComponentMeta` (re-export). Domain types from `src/types.ts` (PNJ-012). `createSeedState` / `assertSeedInvariants` / `MockState` from `src/seed.ts` (PNJ-013). Async repository interfaces and `ImportFileMeta` from `src/repositories/types.ts` (PNJ-014). In-memory `getPlaymatesRepos`, `getState`, and `resetState` (PNJ-015). Naming / slug / title / Facebook body helpers from `src/naming.ts` (PNJ-016). |

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

`packages/db` Prisma schema stays PawPair until the owner migrates it. This package must not start that migration.

## Development commands

| Script | Command | Purpose |
|---|---|---|
| `typecheck` | `pnpm --filter @fe-template/mocks typecheck` | TypeScript check |

## Local agent instructions

See `packages/mocks/AGENTS.md`.
