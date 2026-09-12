# Phase 2 — execution plan (JabKit install + domain components)

Planning artifact only. This file adds **no** components. It is the running order and the per-ticket contract for the coordinator executing Phase 2 (PNJ-019 → PNJ-040).

Sources of truth, in precedence order:

1. [`00-conventions.md`](00-conventions.md) — wins over any ticket unless a ticket says "override conventions for this ticket only".
2. [`05-phase-2-component-library.md`](05-phase-2-component-library.md) — ticket bodies.
3. [`02-metadata.md`](02-metadata.md) — `meta.ts` (Track A) shape.
4. [`99-ticket-index.md`](99-ticket-index.md) — dependency graph.

---

## 1. Execution rules (owner constraints)

| Rule | Value |
|---|---|
| Concurrency | **Sequential.** One ticket at a time, one branch at a time. Never start ticket N+1 before N is merged. |
| Merge | **Auto-merge after each ticket.** Do not wait on CI or any pipeline result. |
| Execution model | `grok-4.6`, effort **medium** |
| Tests | **None.** No Vitest, no Playwright, no `*.test.*`, no `*.spec.*`, no new test config in this phase. |
| Storybook | **Mandatory.** Every new component ships `.stories.tsx`. A ticket without stories is incomplete. |
| Lint | Biome must be clean **on touched files**. Do not repo-wide-reformat unrelated files. |
| Type check | Must pass for the app the ticket touched. |
| Branch naming | `cursor/pnj-0NN-<kebab-name>-a00d` (one branch per ticket) |
| Commits | Conventional Commits (commitlint + husky are installed). No `--no-verify`, no force push. |

### Per-ticket loop (identical for all 22 tickets)

```bash
git checkout main && git pull origin main
git checkout -b cursor/pnj-0NN-<kebab-name>-a00d
# ... implement the ticket's Create list ...
pnpm exec biome check --write <each touched path>      # lint touched files only
pnpm --filter <web|admin> typecheck
pnpm --filter <web|admin> lint                         # ESLint (storybook plugin catches bad stories)
git add <touched paths> && git commit -m "feat(<scope>): <summary> (PNJ-0NN)"
git push -u origin cursor/pnj-0NN-<kebab-name>-a00d
# open PR with the Closes line, enable auto-merge, move on. Do not poll CI.
```

`pnpm lint` (repo-wide `biome check .`) is allowed as a read-only check, but stage only the ticket's files. `lint-staged` already runs `biome check --write` on staged files at commit time, so a clean `biome check` on touched paths before `git add` prevents a surprise reformat inside the commit.

Do **not** run `pnpm build` in Phase 2 (convention: builds are Phase 7).

---

## 2. Pre-flight facts (verified in-repo on 2026-09-12)

These were checked against the working tree so executing agents do not rediscover them.

- **Phases 0 and 1 are merged.** `apps/web/jabkit.config.json` exists with the exact shape mandated by `00-conventions.md`. `packages/mocks` has `types.ts`, `seed.ts`, `store.ts`, `memory/`, `naming.ts`, `upload-simulator.ts`, `public.ts`, `get-repos.ts`. `apps/web/src/lib/playmates.ts` and `apps/admin/src/lib/playmates.ts` exist (PNJ-018). So every Phase 2 dependency (PNJ-010, PNJ-012, PNJ-016) is satisfied and no Phase 2 ticket is blocked on unfinished work.
- **JabKit registry is live.** `https://jabkit.joseadrianbuctuanon.dev/r/index.json` returns HTTP 200 with 96 entries. Every name required by PNJ-019 and PNJ-020 exists, so **no substitutions are expected**: `button`, `badge`, `skeleton`, `separator`, `avatar` (atoms); `hero228`, `gallery31`, `projects16`, `team17`, `count-up`, `split-text`, `spotlight-card`, `footer-section` (marketing). `hero-section-5` and `tubelight-navbar` also exist but are deliberately **not** installed (see §4).
- **`apps/web/src/components/` does not exist yet.** PNJ-019 creates it. It is the single carved exception and must contain JabKit CLI output only.
- **`@fe-template/config` is not a dependency of either app**, but `packages/mocks/src/index.ts` re-exports the meta type. Every `meta.ts` must therefore use:

  ```ts
  import type { PlaymatesComponentMeta } from "@fe-template/mocks";
  ```

  Do **not** add `@fe-template/config` to `apps/web/package.json` or `apps/admin/package.json` — that is an unnecessary dependency change in a component ticket.
- **Storybook already discovers new folders.** Both `apps/web/.storybook/main.ts` and `apps/admin/.storybook/main.ts` glob `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)` and alias `@` → `../src`. `src/sections/_shared/**` and `src/modules/playmates/**` are covered. **No Storybook config edits are needed in any Phase 2 ticket.**
- **`Badge` from `@fe-template/ui` has exactly six variants**: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`. There is no `success` or `warning`. PNJ-038 must map every status into those six (convention: "do not invent new colors outside tokens").
- **`FileUploader` from `@fe-template/ui` is single-file, image-first, and upload-callback driven** (`{ value, onChange(url), onUpload(file): Promise<string>, accept }`, default `accept="image/*"`). It cannot express "multiple videos, no upload". PNJ-027 must therefore compose a hidden `<input type="file" accept="video/*" multiple>` locally and must **not** use `FileUploader`. This resolves the ticket's "if it supports multi video; otherwise…" branch in advance.
- **`DataTable` is exported from `@fe-template/ui`** (source: `packages/ui/src/components/table/data-table/DataTable.tsx`). PNJ-033 may use it or plain `Table` primitives; either satisfies the convention against raw `<table>`.
- **Domain status unions already exist** in `@fe-template/mocks` and must be imported, never re-declared: `SessionStatus`, `GameStatus`, `RecordingStatus`, `UploadJobStatus`, `Visibility`, `CameraSide` (`"A" | "B" | "UNASSIGNED"`), `Provider` (`"google_drive" | "youtube"`), `ProviderAsset`.
- **`formatMatchup` and `formatSessionDisplayDate` are exported** from `@fe-template/mocks`. PNJ-021 and PNJ-025 use them instead of hand-rolling formatting.
- **Web has no `react-hook-form`; admin does.** No Phase 2 ticket needs a form schema (`.schema.ts`) — every widget is presentational or parent-controlled.

---

## 3. Sequential order

The owner's proposed order is **dependency-correct as written**, so it is adopted verbatim. Verification against `99-ticket-index.md`:

- 019 ← PNJ-010 (done) · 020 ← 019 · 038 ← PNJ-012 (done) · 039 ← PNJ-012 (done) · 040 ← none
- 021 ← 019 · 022 ← PNJ-016 (done) + 019 · 023 ← 019 · 024 ← 019 · 025 ← PNJ-016 (done)
- 026 ← 038 · 027 ← none · 028 ← 026 · 029 ← 026 + 028 · 030 ← 025
- 031 ← 038 · 032 ← 031 · 033 ← 031 · 034 ← none · 035 ← 038 · 036 ← 038 · 037 ← none

Every predecessor lands earlier in the list. **No changes to the proposed order.** Two things worth naming rather than reordering:

1. Putting **PNJ-038 third** (before all cards) is the load-bearing choice: five later tickets (026, 031, 035, 036, plus admin's copy) depend on it, and it also unblocks the admin half. Keep it there.
2. PNJ-022 (`GameCard`) takes `matchupLabel` as a plain **string**, so it does not actually depend on PNJ-025 (`MatchupLabel`). Running 025 before 022 would let GameCard compose the component instead — but that is a props change the ticket does not ask for. Keep 022 before 025 and keep `matchupLabel: string`.

| # | Ticket | Issue | App | Size | Depends on (all earlier) |
|---|---|---|---|---|---|
| 1 | PNJ-019 Install JabKit atoms | [#17](https://github.com/jose-codegourmet/playmates-ni-jose/issues/17) | web | S | PNJ-010 ✅ |
| 2 | PNJ-020 Install JabKit marketing blocks | [#19](https://github.com/jose-codegourmet/playmates-ni-jose/issues/19) | web | M | PNJ-019 |
| 3 | PNJ-038 `StatusBadge` + `VisibilityBadge` | [#38](https://github.com/jose-codegourmet/playmates-ni-jose/issues/38) | web + admin copy | XS | PNJ-012 ✅ |
| 4 | PNJ-039 `ProviderLinkList` | [#39](https://github.com/jose-codegourmet/playmates-ni-jose/issues/39) | web | XS | PNJ-012 ✅ |
| 5 | PNJ-040 `YoutubeEmbed` | [#40](https://github.com/jose-codegourmet/playmates-ni-jose/issues/40) | web | S | — |
| 6 | PNJ-021 `SessionCard` | [#18](https://github.com/jose-codegourmet/playmates-ni-jose/issues/18) | web | S | PNJ-019 |
| 7 | PNJ-022 `GameCard` | [#20](https://github.com/jose-codegourmet/playmates-ni-jose/issues/20) | web | S | PNJ-016 ✅, PNJ-019 |
| 8 | PNJ-023 `PlayerCard` | [#25](https://github.com/jose-codegourmet/playmates-ni-jose/issues/25) | web | S | PNJ-019 |
| 9 | PNJ-024 `VenueCard` | [#21](https://github.com/jose-codegourmet/playmates-ni-jose/issues/21) | web | XS | PNJ-019 |
| 10 | PNJ-025 `MatchupLabel` | [#22](https://github.com/jose-codegourmet/playmates-ni-jose/issues/22) | web | XS | PNJ-016 ✅ |
| 11 | PNJ-026 `RecordingCard` | [#23](https://github.com/jose-codegourmet/playmates-ni-jose/issues/23) | admin | S | PNJ-038 |
| 12 | PNJ-027 `RecordingDropzone` | [#24](https://github.com/jose-codegourmet/playmates-ni-jose/issues/24) | admin | M | — |
| 13 | PNJ-028 `CameraSideLane` | [#28](https://github.com/jose-codegourmet/playmates-ni-jose/issues/28) | admin | S | PNJ-026 |
| 14 | PNJ-029 `GameRecordingBoard` | [#29](https://github.com/jose-codegourmet/playmates-ni-jose/issues/29) | admin | M | PNJ-026, PNJ-028 |
| 15 | PNJ-030 `GameTeamEditor` | [#30](https://github.com/jose-codegourmet/playmates-ni-jose/issues/30) | admin | M | PNJ-025 |
| 16 | PNJ-031 `UploadProviderStatus` | [#31](https://github.com/jose-codegourmet/playmates-ni-jose/issues/31) | admin | S | PNJ-038 |
| 17 | PNJ-032 `UploadQueue` | [#32](https://github.com/jose-codegourmet/playmates-ni-jose/issues/32) | admin | S | PNJ-031 |
| 18 | PNJ-033 `UploadMatrix` | [#33](https://github.com/jose-codegourmet/playmates-ni-jose/issues/33) | admin | S | PNJ-031 |
| 19 | PNJ-034 `FacebookPostPreview` | [#34](https://github.com/jose-codegourmet/playmates-ni-jose/issues/34) | admin | S | — |
| 20 | PNJ-035 `SessionPublishChecklist` | [#35](https://github.com/jose-codegourmet/playmates-ni-jose/issues/35) | admin | S | PNJ-038 |
| 21 | PNJ-036 `SessionWorkspaceHeader` | [#36](https://github.com/jose-codegourmet/playmates-ni-jose/issues/36) | admin | S | PNJ-038 |
| 22 | PNJ-037 `SessionWorkspaceStepper` | [#37](https://github.com/jose-codegourmet/playmates-ni-jose/issues/37) | admin | S | — |

---

## 4. JabKit rules (binding for PNJ-019 and PNJ-020)

1. **Install only from `apps/web`.** `cd apps/web` first — the CLI reads `jabkit.config.json` from `process.cwd()`.
2. **Never install JabKit into `apps/admin`.** Never run `jabkit init` at the repo root. Admin stays on `@fe-template/ui` for everything.
3. **Never add JabKit as an npm workspace package** and never import from such a package. Source-copy via `@jabkit/cli@0.1.2` only.
4. **Never `add --all`.** Never `upgrade` (it is a stub).
5. **Dry-run first**, read the file list and npm deps, then re-run without `--dry-run`. Record any overwrite risk in the PR body.
6. **Install pristine.** Do not edit installed files in the same step as `add`, and never strip `--jk-*` tokens. If `add` wants to append `:root` / `.dark` `--jk-*` vars to `apps/web/src/app/globals.css`, verify the PNJ-010 bridge still wins (no conflicting hex) and do not hand-tune installed CSS.
7. **No `--force`** unless a deliberate refresh is the point of the ticket.
8. **Keep `registryDependencies`.** Extra atoms pulled in transitively stay; do not prune them.
9. **Do not install** dashboard shells (`application-shell1`, `login4`, `kanban`, …) or ecommerce / waitlist / pricing blocks into web.
10. **No Playmates widgets in `packages/ui`.** Public domain components live in `apps/web/src/sections/_shared/<kebab>/`; admin domain widgets live in `apps/admin/src/modules/playmates/<kebab>/`. If both apps need the same card, **duplicate the presentational file** — apps cannot import each other's `src`, and a third package is forbidden.
11. **`apps/web/src/components/jabkit/` holds CLI output only.** No hand-written Playmates components in that tree.
12. **PNJ-038 copies `StatusBadge` into admin** in the same ticket (see ticket 3 below). That duplication is intentional and pre-approved.

### PNJ-020 scope decision (owner directive)

Install **`hero228` only** as the hero. **Skip `hero-section-5` and `tubelight-navbar`** — do not even add them speculatively. Both exist in the registry, so if PNJ-042/043 later decides it needs one, it can be added then in its own ticket. Rationale: one hero, less motion/video, and the template `Header` stays. `footer-section` is still installed in this ticket because it is on the manifest and PNJ-042 may compose it; it just must not replace `Footer` in Phase 2.

---

## 5. Per-ticket contracts

Every component ticket produces the four-file set from `00-conventions.md`:

```text
ComponentName.tsx
ComponentName.types.ts
ComponentName.meta.ts     # Track A, imports PlaymatesComponentMeta from @fe-template/mocks
ComponentName.stories.tsx
```

Unless noted, these apply to every ticket below and are not repeated:

- **Props must be serializable** for RSC (no `File`, no functions) unless the file is `"use client"`.
- **Do not touch** `packages/ui`, `packages/db`, `packages/mocks`, `ROADMAP/`, `openspec/`, `.storybook/`, any `globals.css`, any route under `src/app/`, or the other app.
- **Do not** add dependencies, tests, or route wiring. Phase 3–5 tickets compose these components into pages.
- **Stories** must include a dark-theme variant or rely on the existing Storybook theme toggle; `02-metadata.md` asks for light + dark capture in `preview.capture.themes`.

---

### 1. PNJ-019 — Install JabKit atoms · issue #17 · `apps/web`

**Create:** CLI output under `apps/web/src/components/jabkit/` (`button`, `badge`, `skeleton`, `separator`, `avatar` + any `registryDependencies`) and a hand-written smoke story at `apps/web/src/sections/_shared/jabkit-smoke/JabkitSmoke.stories.tsx`.
**Edit:** `apps/web/package.json` / lockfile only as written by the CLI's `pnpm add`.

```bash
cd apps/web
npx @jabkit/cli@0.1.2 add button badge skeleton separator avatar --dry-run
npx @jabkit/cli@0.1.2 add button badge skeleton separator avatar
```

**Storybook:** the smoke story lives **outside** `components/jabkit/` and renders the installed Badge + Button in light and dark to prove token bridging. It is a story-only file; no `.tsx`/`.types.ts`/`.meta.ts` component is authored (installed JabKit blocks ship their own meta — `02-metadata.md` forbids a second meta file for an unwrapped block).
**Validate:** `pnpm exec biome check --write apps/web/src/sections/_shared/jabkit-smoke` → `pnpm --filter web typecheck` → `pnpm --filter web lint`. Never Biome-format installed JabKit files beyond what the CLI's own formatter did.
**Acceptance:** typecheck passes; smoke story shows no raw color leakage (e.g. `bg-red-500`).
**Closes:** `Closes #17`
**Do not touch:** `packages/ui`, `apps/admin`, `globals.css` (PNJ-010 owns it), installed files after `add`.

---

### 2. PNJ-020 — Install JabKit marketing blocks · issue #19 · `apps/web`

**Create:** CLI output under `apps/web/src/components/jabkit/`.
**Edit:** `apps/web/AGENTS.md` — append the installed name list. `apps/web/package.json` / lockfile via CLI only.

```bash
cd apps/web
npx @jabkit/cli@0.1.2 add hero228 gallery31 projects16 team17 count-up split-text spotlight-card footer-section --dry-run
npx @jabkit/cli@0.1.2 add hero228 gallery31 projects16 team17 count-up split-text spotlight-card footer-section
```

Split into two batches if the CLI is happier. **Do not add `hero-section-5` or `tubelight-navbar`** (§4).
**Storybook:** none required (installed blocks are not wrapped in this ticket).
**Validate:** `pnpm --filter web typecheck` → `pnpm --filter web lint`. Biome only on `apps/web/AGENTS.md` if it needs it.
**Acceptance:** each installed folder contains a `*.tsx`; typecheck passes; `registryDependencies` pulled in are listed in the PR body and left in place.
**Closes:** `Closes #19`
**Do not touch:** installed source after `add`, `apps/admin`, `packages/ui`, `globals.css`.

---

### 3. PNJ-038 — `StatusBadge` + `VisibilityBadge` · issue #38 · `apps/web` **and** `apps/admin`

**Create (web):** `apps/web/src/sections/_shared/status-badge/StatusBadge.{tsx,types.ts,meta.ts,stories.tsx}` — export **both** badges from the folder.
**Create (admin, same ticket):** `apps/admin/src/modules/playmates/status-badge/StatusBadge.{tsx,types.ts,meta.ts,stories.tsx}` — a **copy**. Cross-app `src` imports are illegal, so duplication is the sanctioned answer.
**Contract:** map `SessionStatus`, `GameStatus`, `RecordingStatus`, `UploadJobStatus` and `Visibility` (all imported from `@fe-template/mocks`) onto the six existing `Badge` variants. `failed`/`cancelled` → `destructive`; terminal-good (`published`, `completed`, `uploaded`, `ready`) → `default` or `secondary`; in-flight → `secondary`/`outline`; `archived`/`draft` → `outline`. Exhaustive `satisfies Record<...>` maps so a future status cannot silently fall through. **No new colors, no new `Badge` variant, no class-level hex.**
**Storybook:** one story per status union (session, game, recording, upload job) plus `VisibilityBadge` private/public — in **both** apps.
**Validate:** `pnpm exec biome check --write apps/web/src/sections/_shared/status-badge apps/admin/src/modules/playmates/status-badge` → `pnpm --filter web typecheck` → `pnpm --filter admin typecheck` → `pnpm --filter web lint` → `pnpm --filter admin lint`.
**Closes:** `Closes #38`
**Do not touch:** `packages/ui` (absolutely no badge variant added there), `packages/mocks`, `globals.css`. Do not make admin import from web.

---

### 4. PNJ-039 — `ProviderLinkList` · issue #39 · `apps/web`

**Create:** `apps/web/src/sections/_shared/provider-link-list/ProviderLinkList.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ assets: { provider: Provider; url: string; label?: string }[] }`. Group Google Drive vs YouTube. Empty → "No public links yet". External links get `target="_blank"` + `rel="noopener noreferrer"`. Never render `href="#"`.
**Storybook:** both providers, Drive-only, YouTube-only, empty.
**Validate:** `pnpm exec biome check --write apps/web/src/sections/_shared/provider-link-list` → `pnpm --filter web typecheck` → `pnpm --filter web lint`.
**Closes:** `Closes #39`
**Do not touch:** `apps/admin`, `packages/*`.

---

### 5. PNJ-040 — `YoutubeEmbed` · issue #40 · `apps/web`

**Create:** `apps/web/src/sections/_shared/youtube-embed/YoutubeEmbed.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ embedUrl?: string; title: string }`. Responsive 16:9 (`aspect-video` or the `AspectRatio` primitive), `loading="lazy"`, no autoplay. Missing `embedUrl` → quiet empty state, never a broken iframe.
**Storybook:** with url, without url.
**Validate:** `pnpm exec biome check --write apps/web/src/sections/_shared/youtube-embed` → `pnpm --filter web typecheck` → `pnpm --filter web lint`.
**Closes:** `Closes #40`
**Do not touch:** `apps/admin`, `packages/*`.

---

### 6. PNJ-021 — `SessionCard` · issue #18 · `apps/web`

**Read first:** [`docs/06-ui/public-site.md`](../docs/06-ui/public-site.md) (Sessions index cards).
**Create:** `apps/web/src/sections/_shared/session-card/SessionCard.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ href, sessionDate, title?, venueName?, gameCount, playerNames: string[], thumbnailUrl? }`. Render date as `Sep 9, 2026` (prefer `formatSessionDisplayDate` from `@fe-template/mocks` over a local formatter), venue, `N games`, up to 5 player names then `+K`. Use `Card` from `@fe-template/ui` (preferred for density) — `spotlight-card` is allowed only if it is strictly less work. `next/image` for `thumbnailUrl`; no hotlinked photos.
**Storybook:** default, no venue, 12 players, no games.
**Validate:** `pnpm exec biome check --write apps/web/src/sections/_shared/session-card` → `pnpm --filter web typecheck` → `pnpm --filter web lint`.
**Closes:** `Closes #18`
**Do not touch:** `apps/admin`, `packages/*`, routes.

---

### 7. PNJ-022 — `GameCard` · issue #20 · `apps/web`

**Create:** `apps/web/src/sections/_shared/game-card/GameCard.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ href, gameNumber, matchupLabel, recordingCount, youtubeHref?, driveHref? }`. Show game number, matchup, `N videos`, and YouTube / Drive links that open in a new tab when present and are **hidden or disabled** when absent. A missing link must never render `href="#"`. `matchupLabel` stays a string (the fallback `Team 1 vs Team 2` is produced upstream by `formatMatchup`).
**Storybook:** full, empty matchup (`Team 1 vs Team 2`), YouTube-only, no links, 3 videos.
**Validate:** `pnpm exec biome check --write apps/web/src/sections/_shared/game-card` → `pnpm --filter web typecheck` → `pnpm --filter web lint`.
**Closes:** `Closes #20`
**Do not touch:** `apps/admin`, `packages/*`.

---

### 8. PNJ-023 — `PlayerCard` · issue #25 · `apps/web`

**Create:** `apps/web/src/sections/_shared/player-card/PlayerCard.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ href, displayName, nickname?, sessionCount?, initials, isArchived? }`. Initials avatar via `@fe-template/ui` `Avatar` or the installed JabKit `avatar`. Archived renders muted — **never** hidden or deletable (hard-deleting seed players is forbidden).
**Storybook:** with nickname, without nickname, archived (muted), high session count.
**Validate:** `pnpm exec biome check --write apps/web/src/sections/_shared/player-card` → `pnpm --filter web typecheck` → `pnpm --filter web lint`.
**Closes:** `Closes #25`
**Do not touch:** `apps/admin`, `packages/*`.

---

### 9. PNJ-024 — `VenueCard` · issue #21 · `apps/web`

**Create:** `apps/web/src/sections/_shared/venue-card/VenueCard.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ href, name, address?, sessionCount }`. Smallest card in the set; `Card` from `@fe-template/ui`.
**Storybook:** default, no address, zero sessions.
**Validate:** `pnpm exec biome check --write apps/web/src/sections/_shared/venue-card` → `pnpm --filter web typecheck` → `pnpm --filter web lint`.
**Closes:** `Closes #21`
**Do not touch:** `apps/admin`, `packages/*`.

---

### 10. PNJ-025 — `MatchupLabel` · issue #22 · `apps/web`

**Create:** `apps/web/src/sections/_shared/matchup-label/MatchupLabel.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** purely presentational `{ team1: string[]; team2: string[] }` → `A & B vs C & D`. Empty teams → `Team 1 vs Team 2`. Also export a thin helper that delegates to `formatMatchup` from `@fe-template/mocks` (importing the package from web is fine) — do not reimplement the string rules.
**Storybook:** doubles, singles, one empty team, both empty.
**Validate:** `pnpm exec biome check --write apps/web/src/sections/_shared/matchup-label` → `pnpm --filter web typecheck` → `pnpm --filter web lint`.
**Closes:** `Closes #22`
**Do not touch:** `packages/mocks/src/naming.ts` (consume it, do not change it), `apps/admin`.

---

### 11. PNJ-026 — `RecordingCard` · issue #23 · `apps/admin`

From here on: **`@fe-template/ui` only, no JabKit**, everything under `apps/admin/src/modules/playmates/<kebab>/`.

**Read first:** [`docs/06-ui/admin-session-workspace.md`](../docs/06-ui/admin-session-workspace.md) (Organize screen).
**Create:** `apps/admin/src/modules/playmates/recording-card/RecordingCard.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ id, originalFilename, displayName?, sizeBytes, durationSeconds?, cameraSide, partNumber, gameLabel? }`. Dense row/card. Include a **drag-handle affordance** (a real `<button>` with an accessible label) but **no DnD library** — behavior lands in PNJ-065. `cameraSide` uses the `CameraSide` union from `@fe-template/mocks` (`"A" | "B" | "UNASSIGNED"`). Status chips come from the admin `StatusBadge` copy created in PNJ-038.
**Storybook:** unassigned, side B part 2, missing duration, long filename.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/recording-card` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #23`
**Do not touch:** `apps/web`, `packages/ui`, `AdminSidebar.tsx`, any route.

---

### 12. PNJ-027 — `RecordingDropzone` · issue #24 · `apps/admin`

**Create:** `apps/admin/src/modules/playmates/recording-dropzone/RecordingDropzone.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** `"use client"`. Large drop zone plus a hidden `<input type="file" accept="video/*" multiple>`. **Do not use `@fe-template/ui` `FileUploader`** — verified single-file/image-first/upload-driven (§2). Emit `onFiles(File[])`; **do not upload anything**. The selected-file preview list is **parent-controlled** via a serializable `filesMeta` prop (or children), so the component holds no `File` state and nothing pretends a `File` survives a reload.
**Storybook:** empty, drag-active, three fake listed files via `filesMeta`.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/recording-dropzone` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #24`
**Do not touch:** `packages/ui` (do not "fix" `FileUploader` for multi-file here), `apps/web`, upload simulator.

---

### 13. PNJ-028 — `CameraSideLane` · issue #28 · `apps/admin`

**Create:** `apps/admin/src/modules/playmates/camera-side-lane/CameraSideLane.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ side: "A" | "B"; recordings: RecordingCardProps[]; onDropRecording?: (id: string) => void }`. Vertical list labeled "Side A" / "Side B". Empty lane → "Drop recordings here". Renders `RecordingCard`; **no DnD library** yet (it must merely be shaped to become a drop target later). Import `RecordingCardProps` from the PNJ-026 `types.ts` — do not redeclare it.
**Storybook:** empty lane, side A with 2 recordings, side B with 3 including a part 2.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/camera-side-lane` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #28`
**Do not touch:** `recording-card/` (consume it unchanged), `apps/web`, `packages/ui`.

---

### 14. PNJ-029 — `GameRecordingBoard` (presentational) · issue #29 · `apps/admin`

**Create:** `apps/admin/src/modules/playmates/game-recording-board/GameRecordingBoard.{tsx,types.ts,meta.ts,stories.tsx}` plus `board.fixture.ts`.
**Contract:** props `{ unassigned: RecordingCardProps[]; games: { id, gameNumber, sides: { A: RecordingCardProps[]; B: RecordingCardProps[] } }[] }`. Desktop: two columns (Unassigned Files | Game Workspace). Mobile: stacked, unassigned first. **No DnD** (PNJ-065). Do **not** enforce "exactly two recordings per game" in types or UI.
**Storybook:** MVP seed shape (10 games, 21 files) from the **static** `board.fixture.ts`. Do not import the in-memory store singleton into Storybook.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/game-recording-board` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #29`
**Do not touch:** `packages/mocks` (copy seed numbers into the fixture, do not export new helpers), `recording-card/`, `camera-side-lane/`, `apps/web`.

---

### 15. PNJ-030 — `GameTeamEditor` · issue #30 · `apps/admin`

**Read first:** [`docs/04-workflows/player-assignment.md`](../docs/04-workflows/player-assignment.md).
**Create:** `apps/admin/src/modules/playmates/game-team-editor/GameTeamEditor.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** `"use client"`. Two zones, Team 1 / Team 2. Props `{ roster: { id, displayName }[]; team1: string[]; team2: string[]; onChange(next); onCopyPrevious?() }`. Actions: add from roster select, remove, swap teams, clear team. "Copy previous" only **calls** `onCopyPrevious` — the parent implements it. **Never infer teams from camera Side A / Side B.** Matchup preview: reimplement the label locally or copy the PNJ-025 presentational logic — admin must not import from `apps/web/src`.
**Storybook:** empty, doubles, singles, roster exhausted.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/game-team-editor` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #30`
**Do not touch:** `apps/web`, `packages/ui`, `packages/mocks`. No `react-hook-form` (this is a controlled widget, not a form).

---

### 16. PNJ-031 — `UploadProviderStatus` · issue #31 · `apps/admin`

**Create:** `apps/admin/src/modules/playmates/upload-provider-status/UploadProviderStatus.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ provider: Provider; status: UploadJobStatus; progressPercent?: number; errorMessage?: string }` (unions from `@fe-template/mocks`). Show `Progress` from `@fe-template/ui` while uploading/processing. `failed` → destructive badge + visible error text. Reuse the admin `StatusBadge` copy.
**Storybook:** queued, uploading 42%, processing, completed, failed with message, cancelled — for both providers.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/upload-provider-status` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #31`
**Do not touch:** `apps/web`, `packages/*`, upload simulator wiring (Phase 6).

---

### 17. PNJ-032 — `UploadQueue` · issue #32 · `apps/admin`

**Create:** `apps/admin/src/modules/playmates/upload-queue/UploadQueue.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ items: { recordingLabel, drive, youtube }[] }` where `drive`/`youtube` are `UploadProviderStatusProps` (imported from PNJ-031's `types.ts`). List of recordings with stacked per-provider statuses. Empty → quiet empty state.
**Storybook:** mixed states, all completed, one failed provider, empty.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/upload-queue` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #32`
**Do not touch:** `upload-provider-status/`, `apps/web`, `packages/*`.

---

### 18. PNJ-033 — `UploadMatrix` · issue #33 · `apps/admin`

**Read first:** admin Upload screen table in [`docs/06-ui/admin-session-workspace.md`](../docs/06-ui/admin-session-workspace.md).
**Create:** `apps/admin/src/modules/playmates/upload-matrix/UploadMatrix.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** columns Recording | Drive | YouTube. Use `DataTable` or `Table` primitives from `@fe-template/ui` — **never a raw `<table>`**. Failed cells stay visible; do not hide or collapse them. Cells reuse `UploadProviderStatus`.
**Storybook:** full matrix, matrix with failures, single row, empty.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/upload-matrix` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #33`
**Do not touch:** `packages/ui`, `apps/web`.

---

### 19. PNJ-034 — `FacebookPostPreview` · issue #34 · `apps/admin`

**Create:** `apps/admin/src/modules/playmates/facebook-post-preview/FacebookPostPreview.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** `"use client"` (clipboard). Props `{ title?, body, onChange?, onCopy }`. `Textarea` + Copy button using `navigator.clipboard.writeText`. Guard for missing clipboard API. Read-only when `onChange` is absent. Do **not** call the Facebook Graph API or generate the body here — generation is `formatFacebookBody` (PNJ-016), wired in PNJ-075.
**Storybook:** generated body, empty body, read-only.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/facebook-post-preview` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #34`
**Do not touch:** `apps/web`, `packages/*`.

---

### 20. PNJ-035 — `SessionPublishChecklist` · issue #35 · `apps/admin`

**Create:** `apps/admin/src/modules/playmates/session-publish-checklist/SessionPublishChecklist.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** one row/card per game showing matchup, YouTube state, Drive state, visibility, and a **visible, non-blocking** warning when a provider is missing. Props `{ games: [...]; onPublishGame; onPublishAll }` — `"use client"` because of the callbacks. Badges come from the admin `StatusBadge` copy. A missing provider must never disable the publish action.
**Storybook:** all green, missing YouTube on one game, missing both on one game, nothing publishable yet.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/session-publish-checklist` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #35`
**Do not touch:** `apps/web`, `packages/*`, publish actions (Phase 6).

---

### 21. PNJ-036 — `SessionWorkspaceHeader` · issue #36 · `apps/admin`

**Read first:** [`docs/06-ui/admin-session-workspace.md`](../docs/06-ui/admin-session-workspace.md) (Header).
**Create:** `apps/admin/src/modules/playmates/session-workspace-header/SessionWorkspaceHeader.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** props `{ date, title, venueName, status, visibility, saveState: "saved" | "saving" | "error" }`. Desktop-first single row. `status`/`visibility` render through the admin `StatusBadge`/`VisibilityBadge` copy. No decorative motion in admin.
**Storybook:** draft + saved, publishing/uploading + saving, error save, missing title.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/session-workspace-header` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #36`
**Do not touch:** `apps/admin/src/app/(dashboard)/layout.tsx` and the `TITLES` map (PNJ-060 owns workspace routing), `apps/web`, `packages/*`.

---

### 22. PNJ-037 — `SessionWorkspaceStepper` · issue #37 · `apps/admin`

**Create:** `apps/admin/src/modules/playmates/session-workspace-stepper/SessionWorkspaceStepper.{tsx,types.ts,meta.ts,stories.tsx}`
**Contract:** steps in exactly this order — Details, Players, Import, Organize, Matchups, Upload, Review. Props `{ current, completed: StepId[], hrefFor: (step: StepId) => string }` (so `"use client"`, or accept a precomputed href map). `Tabs` from `@fe-template/ui` or a semantic `<ol>`. **Clicking completed *and* future steps is allowed; disable nothing** in the prototype. Export the `StepId` union and the ordered step list from `types.ts` so PNJ-060 reuses them.
**Storybook:** on Details with nothing completed, mid-flow (Organize current, first three completed), all completed on Review.
**Validate:** `pnpm exec biome check --write apps/admin/src/modules/playmates/session-workspace-stepper` → `pnpm --filter admin typecheck` → `pnpm --filter admin lint`.
**Closes:** `Closes #37`
**Do not touch:** routes under `apps/admin/src/app/`, `apps/web`, `packages/*`.

---

## 6. Phase 2 exit checklist

Ticket-level:

- [ ] All 22 tickets merged in the §3 order, each on its own branch and PR, each auto-merged
- [ ] Each PR body carries its `Closes #NN` line and all 22 issues (#17–#40 per the map) are closed
- [ ] Every component folder has all four files: `.tsx`, `.types.ts`, `.meta.ts`, `.stories.tsx`
- [ ] Every `meta.ts` satisfies `PlaymatesComponentMeta`, `name` is kebab-case and equals its folder, `version` is `0.1.0`, `addedAt` is set
- [ ] No new test files, no Vitest/Playwright config changes, no new dependencies beyond what the JabKit CLI added in PNJ-019/020

Boundary-level:

- [ ] JabKit atoms + marketing installed **pristine** under `apps/web/src/components/jabkit/`; `hero-section-5` and `tubelight-navbar` absent
- [ ] `apps/web/AGENTS.md` lists the installed JabKit names
- [ ] `git diff main --stat` shows **zero** changes under `packages/ui/`, `packages/db/`, `packages/mocks/`, and no `globals.css` edits
- [ ] JabKit does not appear in `apps/admin/package.json`; admin has no `src/components/` tree and no `jabkit.config.json`
- [ ] No cross-app `src` imports (`rg "apps/(web|admin)/src" apps` returns nothing); `StatusBadge` exists twice on purpose
- [ ] No Playmates widget in `packages/ui`; no third component package created
- [ ] Admin board is presentational only — no DnD library installed (that is PNJ-065)

Green-light:

- [ ] `pnpm --filter web typecheck` and `pnpm --filter admin typecheck` pass
- [ ] `pnpm lint` reports no new Biome findings on Phase 2 paths
- [ ] `pnpm --filter web lint` and `pnpm --filter admin lint` pass
- [ ] `pnpm --filter web storybook` and `pnpm --filter admin storybook` boot and every new component appears in the sidebar (this is the Phase 2 acceptance surface; the formal sweep is PNJ-078)
- [ ] Phase 3 can start: PNJ-041 and PNJ-052 are unblocked
