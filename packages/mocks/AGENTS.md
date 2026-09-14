# Agent Instructions — `packages/mocks`

Local agent instructions for the in-memory Playmates data layer. Read `/AGENTS.md` first, then this file.

---

## Scope

`packages/mocks` (`@fe-template/mocks`) is the swappable mock backend for the prototype. Admin Server Actions and web RSC fetchers will call this package only.

- **Workspace name**: `@fe-template/mocks`
- **Filter**: `pnpm --filter @fe-template/mocks`
- **Package name**: `@fe-template/mocks`

This package is **mock data and types only**. Seed data is in `src/seed.ts` (PNJ-013). Repository interfaces are in `src/repositories/types.ts` (PNJ-014). In-memory implementations are in `src/store.ts`, `src/memory/*.ts`, and `src/get-repos.ts` (PNJ-015). The upload simulator (`src/upload-simulator.ts`, PNJ-017) is time-based and must not read `File` bytes.

**Disk exception (PNJ-074):** persist the mock graph to `packages/mocks/.data/store.json` on every write and reload it in `getState()` when the file exists. This is the only allowed I/O. Gitignore `.data/`. Do not store video bytes.

---

## Public entry points

| Entry | Path | What it provides |
|---|---|---|
| `.` | `src/index.ts` | Barrel. Re-exports `PlaymatesComponentMeta`, domain types, seed helpers, repository interfaces, `getPlaymatesRepos` / `getState` / `persistState` / `resetState` (PNJ-015 / PNJ-074), naming generators (`src/naming.ts`, PNJ-016), and the upload simulator / `ASSET_EXISTS` errors (PNJ-017). |

---

## Consumers

- `apps/web`
- `apps/admin`

Do not import this package from `packages/db` or `packages/ui`.

---

## Validation commands

| Concern | Command |
|---|---|
| Type check | `pnpm --filter @fe-template/mocks typecheck` |
| Biome (repo-wide) | `pnpm lint` |

---

## Restrictions and boundaries

- Mock data only. The only allowed I/O is `packages/mocks/.data/store.json` (PNJ-074). No `fetch`, Prisma, or video-byte persistence.
- Do not edit `packages/db` Prisma schema from this package.
- Later tickets add types, seed, repository interfaces, and the in-memory store. Keep the public barrel in `src/index.ts`.

---

## Common task routing

| Task | Read next |
|---|---|
| Domain types | `ROADMAP/04-phase-1-mock-data-layer.md` (PNJ-012) |
| Swap memory for Prisma | `packages/mocks/docs/README.md`, `ROADMAP/11-handoff-to-real-data.md` |
| Component meta type | `ROADMAP/02-metadata.md`, `packages/config` |

---

## Documentation maintenance

Update this file and `packages/mocks/docs/` when public exports or the adapter seam change.

Calendar display metadata: `Session.clubName` and `Game.scores` are optional. Scores are per set for Team 1 and Team 2, independent of camera sides. Existing seed/store records do not require these fields.
