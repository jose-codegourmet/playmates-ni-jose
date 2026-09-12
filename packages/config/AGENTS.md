# Agent Instructions — `packages/config`

Local agent instructions for the shared config package. Read `/AGENTS.md` first, then this file.

---

## Scope

`packages/config` (`@fe-template/config`) holds shared TypeScript types that are not mock data and are not UI primitives. The first export is `PlaymatesComponentMeta` (Track A catalogue descriptors; see `ROADMAP/02-metadata.md`).

- **Workspace name**: `@fe-template/config`
- **Filter**: `pnpm --filter @fe-template/config`
- **Package name**: `@fe-template/config`

---

## Public entry points

| Entry | Path | What it provides |
|---|---|---|
| `.` | `src/index.ts` | `PlaymatesComponentMeta` |

`package.json` also sets `main` and `types` to `./src/index.ts`.

---

## Consumers

- `@fe-template/mocks` re-exports `PlaymatesComponentMeta`.
- Apps should import the type from `@fe-template/config` (preferred) or `@fe-template/mocks`.

---

## Validation commands

| Concern | Command |
|---|---|
| Type check | `pnpm --filter @fe-template/config typecheck` |
| Biome (repo-wide) | `pnpm lint` |

---

## Restrictions

- Keep this package types-only unless a later ticket adds shared config files.
- Do not import `@fe-template/mocks` or `@fe-template/db` here.
- Do not add I/O, React, or Next.js runtime code.

---

## Documentation maintenance

Update this file and `docs/architecture.md` / `docs/dependency-guidelines.md` when exports or consumers change.
