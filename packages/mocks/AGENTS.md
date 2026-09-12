# Agent Instructions — `packages/mocks`

Local agent instructions for the in-memory Playmates data layer. Read `/AGENTS.md` first, then this file.

---

## Scope

`packages/mocks` (`@fe-template/mocks`) is the swappable mock backend for the prototype. Admin Server Actions and web RSC fetchers will call this package only.

- **Workspace name**: `@fe-template/mocks`
- **Filter**: `pnpm --filter @fe-template/mocks`
- **Package name**: `@fe-template/mocks`

This package is **mock data and types only**. Do not add filesystem, network, Prisma, or other I/O here. Seed data is in `src/seed.ts` (PNJ-013). Repository store work lands in later Phase 1 tickets (PNJ-014+).

---

## Public entry points

| Entry | Path | What it provides |
|---|---|---|
| `.` | `src/index.ts` | Barrel. Re-exports `PlaymatesComponentMeta`, domain types, `createSeedState`, `assertSeedInvariants`, `SEED_IDS`, and `MockState`. |

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

- Mock data only. No I/O (no `fs`, `fetch`, Prisma, env reads, or JSON persistence in this ticket).
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
