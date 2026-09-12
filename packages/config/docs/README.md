# Package: `@fe-template/config`

- **Workspace name**: `@fe-template/config`
- **Package name**: `@fe-template/config`
- **Version**: `0.0.1`

## Purpose

Shared TypeScript types used by both apps and by `@fe-template/mocks`. Today this is the Track A `PlaymatesComponentMeta` descriptor from `ROADMAP/02-metadata.md`.

## Public entry points

| Entry | Path | Exports |
|---|---|---|
| `.` | `src/index.ts` | `PlaymatesComponentMeta` |

## Basic usage

```ts
import type { PlaymatesComponentMeta } from "@fe-template/config";

export default {
  name: "game-card",
  displayName: "Game Card",
  version: "0.1.0",
  addedAt: "2026-09-12",
  // ...
} satisfies PlaymatesComponentMeta;
```

## Development commands

| Script | Command | Purpose |
|---|---|---|
| `typecheck` | `pnpm --filter @fe-template/config typecheck` | TypeScript check |

## Local agent instructions

See `packages/config/AGENTS.md`.
