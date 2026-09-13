# Testing — fe-multi-web-template

Testing tools, commands, and conventions in the monorepo.

---

## Current testing landscape

| Workspace | Unit tests | E2E tests | Storybook | Config |
|---|---|---|---|---|
| `apps/web` | No standalone files | No | Yes (port 6006) | `vitest.config.ts`, Storybook 10 + `@storybook/addon-vitest` |
| `apps/admin` | No | No | Yes (port 6007) | `.storybook/` plus admin-specific stories under `src/` |
| `packages/ui` | No | No | Consumed by `apps/web` storybook | No test config |
| `packages/db` | No | No | No | No test config |

No `test` script exists in any `package.json`. The Vitest setup in `apps/web` is primarily for Storybook's Vitest addon, not for a standalone test suite.

---

## `apps/web` testing setup

`apps/web/vitest.config.ts` configures:

- `@storybook/addon-vitest` browser project
- `@vitest/browser-playwright` provider
- Coverage via `@vitest/coverage-v8`

This runs Storybook stories in Chromium via Playwright.

### Commands

```bash
pnpm --filter web storybook      # start Storybook on port 6006
pnpm --filter web build-storybook # build static Storybook
```

---

## `apps/admin` testing setup

Storybook on port 6007 globs both `apps/admin/src/**/*.stories.*` and `packages/ui` stories.

Playmates domain widgets live under `src/modules/playmates/` and each Phase 2 widget ships a co-located `.stories.tsx` (at least two variants plus a `Dark` story that sets `globals.theme`). Session workspace steps, dashboard widgets, and entity tables/forms also have stories with fixture props — they do not boot the mock memory store.

Do not add Chromatic or visual snapshot infrastructure. The template may already list `@chromatic-com/storybook` as an addon; do not wire a Chromatic project or snapshot tests.

Stories that depend on TanStack Query seed cache via `src/storybook/seeded-query.tsx` so they render without Prisma or a live Supabase session.

### Commands

```bash
pnpm --filter admin storybook       # start Storybook on port 6007
pnpm --filter admin build-storybook # build static Storybook
```

---

## Storybook conventions

- Co-locate stories with components: `ComponentName.stories.tsx` next to `ComponentName.tsx`.
- Co-locate use-case docs: `ComponentName.usecase.md` next to the component.
- Shared primitives are in `packages/ui/src/components/**` and are consumed by both app Storybooks.
- Both app previews register a Theme toolbar (`globals.theme`) that toggles a `.dark` wrapper. Domain stories also export an explicit `Dark` story.
- Public page sections under `apps/web/src/sections/` use mock props. Do not import the mock memory store into Storybook (`SessionsIndex` is a query composer — story the child sections instead).

See `docs/template/COMPONENTS.md` for story conventions.

### PNJ-078 — Phase 2 domain coverage

Every Phase 2 domain component has `.stories.tsx` with at least two variants plus `Dark`:

| Component | Stories |
|---|---|
| `SessionCard` | `apps/web/src/sections/_shared/session-card/` |
| `GameCard` | `apps/web/src/sections/_shared/game-card/` |
| `PlayerCard` | `apps/web/src/sections/_shared/player-card/` |
| `VenueCard` | `apps/web/src/sections/_shared/venue-card/` |
| `MatchupLabel` | `apps/web/src/sections/_shared/matchup-label/` |
| `ProviderLinkList` | `apps/web/src/sections/_shared/provider-link-list/` |
| `YoutubeEmbed` | `apps/web/src/sections/_shared/youtube-embed/` |
| `StatusBadge` / `VisibilityBadge` | `apps/web/src/sections/_shared/status-badge/` (admin copy under `modules/playmates/status-badge/`) |
| `SessionWorkspaceHeader` | `apps/admin/src/modules/playmates/session-workspace-header/` |
| `SessionWorkspaceStepper` | `apps/admin/src/modules/playmates/session-workspace-stepper/` |
| `RecordingCard` | `apps/admin/src/modules/playmates/recording-card/` |
| `RecordingDropzone` | `apps/admin/src/modules/playmates/recording-dropzone/` |
| `CameraSideLane` | `apps/admin/src/modules/playmates/camera-side-lane/` |
| `GameRecordingBoard` | `apps/admin/src/modules/playmates/game-recording-board/` |
| `GameTeamEditor` | `apps/admin/src/modules/playmates/game-team-editor/` |
| `UploadProviderStatus` | `apps/admin/src/modules/playmates/upload-provider-status/` |
| `UploadQueue` | `apps/admin/src/modules/playmates/upload-queue/` |
| `UploadMatrix` | `apps/admin/src/modules/playmates/upload-matrix/` |
| `FacebookPostPreview` | `apps/admin/src/modules/playmates/facebook-post-preview/` |
| `SessionPublishChecklist` | `apps/admin/src/modules/playmates/session-publish-checklist/` |

Grep for a missing Phase 2 story file:

```bash
for f in \
  apps/web/src/sections/_shared/{session-card/SessionCard,game-card/GameCard,player-card/PlayerCard,venue-card/VenueCard,matchup-label/MatchupLabel,provider-link-list/ProviderLinkList,youtube-embed/YoutubeEmbed,status-badge/StatusBadge} \
  apps/admin/src/modules/playmates/{session-workspace-header/SessionWorkspaceHeader,session-workspace-stepper/SessionWorkspaceStepper,recording-card/RecordingCard,recording-dropzone/RecordingDropzone,camera-side-lane/CameraSideLane,game-recording-board/GameRecordingBoard,game-team-editor/GameTeamEditor,upload-provider-status/UploadProviderStatus,upload-queue/UploadQueue,upload-matrix/UploadMatrix,facebook-post-preview/FacebookPostPreview,session-publish-checklist/SessionPublishChecklist,status-badge/StatusBadge}
do
  test -f "${f}.stories.tsx" || echo "MISSING ${f}.stories.tsx"
done
```

Phase 3 public sections (home, sessions, session detail, game detail, players, venues, not-found) each have stories with hardcoded mock props.

---

## Adding tests

If you add a test suite:

1. Add a `test` script to the relevant `package.json`.
2. Add the task to `turbo.json` if it should run in CI.
3. Document the command here and in the relevant app/package docs.
4. Prefer the existing Vitest/Playwright stack in `apps/web` before introducing a new test runner.

---

## Validation commands

| Workspace | Command | Purpose |
|---|---|---|
| `apps/web` | `pnpm --filter web storybook` | Start Storybook |
| `apps/admin` | `pnpm --filter admin storybook` | Start Storybook |
| `apps/web` | `pnpm --filter web build-storybook` | Build static Storybook |
| `apps/admin` | `pnpm --filter admin build-storybook` | Build static Storybook |

There is no `pnpm test` today. Run `pnpm typecheck` and `pnpm lint` as the minimum validation before completing a task.
