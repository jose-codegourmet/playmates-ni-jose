# Phase 2 — JabKit install + domain components

Goal: visual building blocks exist in Storybook (or at least compile) before pages compose them.

**JabKit installs only from `apps/web`.** Domain admin widgets live under `apps/admin/src/modules/playmates/`. Shared-looking cards that both apps need: put the **dumb presentational** component in `apps/web/src/sections/_shared/` for public, and a **separate** admin card in admin if props differ. Do **not** add Playmates widgets to `packages/ui`.

If you truly need one card in both apps, duplicate the 40-line presentational component. Do not create a third package.

Every new component: `.tsx`, `.types.ts`, `.meta.ts`, `.stories.tsx` ([`02-metadata.md`](02-metadata.md)).

---

## JabKit install manifest (do not improvise names)

Run from `apps/web` after PNJ-009 and PNJ-010.

| Priority | CLI name | Category | Used for |
|---|---|---|---|
| 1 | `button` | atoms | Only if you need JabKit button on marketing CTAs. Prefer `@fe-template/ui` Button on admin. |
| 1 | `badge` | atoms | Chips on cards |
| 1 | `skeleton` | atoms | Public loading (admin uses `@fe-template/ui` Skeleton) |
| 1 | `separator` | atoms | Footer / article rules |
| 2 | `hero228` | marketing | Home hero fallback if video hero is too heavy |
| 2 | `hero-section-5` | marketing | Optional cinematic home hero — pick **one** hero, not both, in PNJ-020 |
| 2 | `tubelight-navbar` | marketing | Optional replacement for template Header — only if PNJ-042 chooses it |
| 2 | `footer-section` | marketing | Optional Footer replacement — PNJ-042 |
| 2 | `gallery31` | marketing | Home “recent games” visual |
| 2 | `projects16` | marketing | Sessions index alternative layout |
| 2 | `team17` | marketing | Players index |
| 2 | `count-up` | marketing | Home stats (session count, game count) |
| 2 | `split-text` | marketing | Home headline accent |
| 2 | `spotlight-card` | marketing | Feature/session cards |
| 3 | `avatar` | atoms | Player avatars |
| 3 | `dialog` | atoms | Only on web if needed; admin uses `@fe-template/ui` Dialog |

If a name 404s, search `index.json` and substitute the closest `marketing` block. Record the substitution in the ticket.

**Do not install** dashboard shells (`application-shell1`, `login4`, etc.) into web. **Do not install** ecommerce / waitlist / pricing blocks.

---

### PNJ-019 — Install JabKit atoms

**Phase** 2 · **Depends on** PNJ-010 · **Size** S  
**Read first:** [`00-conventions.md`](00-conventions.md) CLI recipe  
**Create:** files written by the CLI under `apps/web/src/components/jabkit/`  
**Edit:** `apps/web/package.json` only via CLI `pnpm add`  
**Delete:** none  
**Do not touch:** `packages/ui`, `apps/admin`

**Steps:**

1. `cd apps/web`
2. `npx @jabkit/cli@0.1.2 add button badge skeleton separator avatar --dry-run`
3. Review dest paths and deps. If `cssVars` would append to `globals.css`, confirm PNJ-010 bridge still wins (no conflicting hex).
4. Run the same command without `--dry-run`.
5. Do not edit installed files.
6. Add a Storybook story **outside** jabkit: `apps/web/src/sections/_shared/jabkit-smoke/JabkitSmoke.stories.tsx` that renders the installed Badge + Button in light/dark. This proves tokens.

**Acceptance:** typecheck passes. Smoke story renders without raw `bg-red-500` leakage.

**Validate:** `pnpm --filter web typecheck`

---

### PNJ-020 — Install JabKit marketing blocks

**Phase** 2 · **Depends on** PNJ-019 · **Size** M  
**Create:** CLI output  
**Do not touch:** installed source after add  

**Steps:**

1. Dry-run then add, in two batches if the CLI is happier:

   ```bash
   cd apps/web
   npx @jabkit/cli@0.1.2 add hero228 gallery31 projects16 team17 count-up split-text spotlight-card footer-section
   ```

2. Optionally dry-run `hero-section-5` and `tubelight-navbar`. **Do not add them unless** you will use them in PNJ-042/043. Prefer `hero228` + existing Header to reduce motion/video.

3. After install, list `registryDependencies` pulled in (extra atoms). Do not delete them.

4. Update `apps/web/AGENTS.md` with the installed name list.

**Acceptance:** each installed folder has a `*.tsx`. `pnpm --filter web typecheck` passes.

**Validate:** `pnpm --filter web typecheck`

---

## Domain components — public + shared presentational

Put these in `apps/web/src/sections/_shared/<kebab>/` unless noted.

Props must be serializable (no `File`, no functions in RSC). Action callbacks are fine on `"use client"` wrappers.

---

### PNJ-021 — `SessionCard`

**Phase** 2 · **Depends on** PNJ-019 · **Size** S  
**Read first:** [`docs/06-ui/public-site.md`](../docs/06-ui/public-site.md) Sessions index cards  
**Create:** `apps/web/src/sections/_shared/session-card/SessionCard.{tsx,types.ts,meta.ts,stories.tsx}`  
**Do not touch:** admin  

**Steps:**

1. Props: `{ href, sessionDate, title?, venueName?, gameCount, playerNames: string[], thumbnailUrl? }`.
2. Render date (ISO → `Sep 9, 2026`), venue, `N games`, up to 5 player names + “+K”.
3. Use `@fe-template/ui` `Card` **or** compose `spotlight-card` if that is less work. Prefer Card for density.
4. Stories: default, no venue, 12 players, no games.

**Acceptance:** Storybook or a temporary usage shows all four stories.

**Validate:** `pnpm --filter web typecheck`

---

### PNJ-022 — `GameCard`

**Phase** 2 · **Depends on** PNJ-016 (for matchup examples), PNJ-019 · **Size** S  
**Create:** `apps/web/src/sections/_shared/game-card/GameCard.{tsx,types.ts,meta.ts,stories.tsx}`  

**Steps:**

1. Props: `{ href, gameNumber, matchupLabel, recordingCount, youtubeHref?, driveHref? }`.
2. Show game number, matchup, “N videos”, buttons/links “YouTube” / “Drive” that `target=_blank` when href present, disabled/hidden when absent.
3. Stories: full, empty matchup (`Team 1 vs Team 2`), youtube-only, no links, 3 videos.

**Acceptance:** missing links do not render a dead `href="#"`.

**Validate:** web typecheck.

---

### PNJ-023 — `PlayerCard`

**Phase** 2 · **Depends on** PNJ-019 · **Size** S  
**Create:** `apps/web/src/sections/_shared/player-card/PlayerCard.{tsx,types.ts,meta.ts,stories.tsx}`  

Props: `{ href, displayName, nickname?, sessionCount?, initials }`. Avatar from initials via `@fe-template/ui` Avatar or JabKit avatar. Stories: with nickname, archived-looking muted (if `isArchived`).

**Validate:** web typecheck.

---

### PNJ-024 — `VenueCard`

**Phase** 2 · **Depends on** PNJ-019 · **Size** XS  
**Create:** `apps/web/src/sections/_shared/venue-card/VenueCard.{tsx,types.ts,meta.ts,stories.tsx}`  

Props: `{ href, name, address?, sessionCount }`.

**Validate:** web typecheck.

---

### PNJ-025 — `MatchupLabel`

**Phase** 2 · **Depends on** PNJ-016 · **Size** XS  
**Create:** `apps/web/src/sections/_shared/matchup-label/MatchupLabel.{tsx,types.ts,meta.ts,stories.tsx}`  

Presentational: `{ team1: string[]; team2: string[] }` renders `A & B vs C & D`. Empty teams → `Team 1 vs Team 2`. Also export a tiny helper that calls `formatMatchup` from mocks if importing the package in web is OK (it is).

**Validate:** web typecheck.

---

### PNJ-039 — `ProviderLinkList`

**Phase** 2 · **Depends on** PNJ-012 · **Size** XS  
**Create:** `apps/web/src/sections/_shared/provider-link-list/ProviderLinkList.{tsx,types.ts,meta.ts,stories.tsx}`  

Props: `{ assets: { provider, url, label? }[] }`. Groups Drive vs YouTube. Empty → “No public links yet”.

---

### PNJ-040 — `YoutubeEmbed`

**Phase** 2 · **Depends on** none · **Size** S  
**Create:** `apps/web/src/sections/_shared/youtube-embed/YoutubeEmbed.{tsx,types.ts,meta.ts,stories.tsx}`  

Props: `{ embedUrl, title }`. Responsive 16:9 iframe. If `embedUrl` missing, render a quiet empty state, not a broken iframe. `loading="lazy"`. No autoplay.

Stories: with url, without url.

---

### PNJ-038 — `StatusBadge` + `VisibilityBadge`

**Phase** 2 · **Depends on** PNJ-012 · **Size** XS  
**Create:** `apps/web/src/sections/_shared/status-badge/StatusBadge.{tsx,types.ts,meta.ts,stories.tsx}` (export both badges from the folder)  

Map session/game/recording/job statuses to `@fe-template/ui` `Badge` variants. Do not invent new colors outside tokens.

Admin may import this from a **copied** file under `apps/admin/src/modules/playmates/status-badge/` if cross-app imports are illegal (they are — apps cannot import each other’s src). **Copy the 30-line file into admin** in this same ticket.

**Do not** put it in `packages/ui`.

---

## Domain components — admin

All under `apps/admin/src/modules/playmates/<kebab>/` with the four files (+ `.schema.ts` if form).

Use `@fe-template/ui` only (no JabKit).

---

### PNJ-036 — `SessionWorkspaceHeader`

**Phase** 2 · **Depends on** PNJ-038 · **Size** S  
**Read first:** [`docs/06-ui/admin-session-workspace.md`](../docs/06-ui/admin-session-workspace.md) Header  
**Create:** `apps/admin/src/modules/playmates/session-workspace-header/*`  

Props: `{ date, title, venueName, status, visibility, saveState: "saved" | "saving" | "error" }`. Desktop-first row. Stories: draft, publishing, error save.

---

### PNJ-037 — `SessionWorkspaceStepper`

**Phase** 2 · **Depends on** none · **Size** S  
**Create:** `apps/admin/src/modules/playmates/session-workspace-stepper/*`  

Steps in order: Details, Players, Import, Organize, Matchups, Upload, Review. Props: `{ current, completed: StepId[], hrefFor: (step) => string }`. Use `@fe-template/ui` Tabs or a simple ol. Allow clicking completed **and** future steps (docs: “Allow navigation between steps after data exists”). Disable none in the prototype.

---

### PNJ-026 — `RecordingCard`

**Phase** 2 · **Depends on** PNJ-038 · **Size** S  
**Read first:** organize screen  
**Create:** `apps/admin/src/modules/playmates/recording-card/*`  

Props: `{ id, originalFilename, displayName?, sizeBytes, durationSeconds?, cameraSide, partNumber, gameLabel? }`. Dense row/card. Must have a drag handle affordance (button with `aria-grabbed` later). Stories: unassigned, side B part 2, missing duration.

---

### PNJ-027 — `RecordingDropzone`

**Phase** 2 · **Depends on** none · **Size** M  
**Create:** `apps/admin/src/modules/playmates/recording-dropzone/*`  

`"use client"`. Large drop zone + file input `accept="video/*"` multiple. Use `@fe-template/ui` `FileUploader` if it supports multi video; otherwise compose on top of a hidden input. On drop, emit `onFiles(File[])`. Do not upload. Show a list preview of selected names/sizes **controlled by parent**.

Stories: empty, with 3 fake listed files (pass children or a `filesMeta` prop).

---

### PNJ-028 — `CameraSideLane`

**Phase** 2 · **Depends on** PNJ-026 · **Size** S  
**Create:** `apps/admin/src/modules/playmates/camera-side-lane/*`  

Props: `{ side: "A" | "B", recordings: RecordingCardProps[], onDropRecording?: (id: string) => void }`. Vertical list labeled “Side A” / “Side B”. Empty lane shows “Drop recordings here”. Must be a drop target in later tickets; this ticket can render the lane without DnD library.

---

### PNJ-029 — `GameRecordingBoard` (presentational)

**Phase** 2 · **Depends on** PNJ-026, PNJ-028 · **Size** M  
**Create:** `apps/admin/src/modules/playmates/game-recording-board/*`  

Layout from docs:

```text
Unassigned Files     Game Workspace
[cards]              Game 1 { Side A lane | Side B lane }
                     Game 2 ...
```

Props: `{ unassigned: RecordingCardProps[]; games: { id, gameNumber, sides: { A: ...; B: ... } }[] }`. Desktop: two columns. Mobile: stack, unassigned first. **No DnD yet** (PNJ-065). Stories: MVP seed shape (10 games, 21 files) using hardcoded fixture copied from seed numbers — do not import Node singleton into Storybook if it explodes; use a static JSON fixture `board.fixture.ts`.

---

### PNJ-030 — `GameTeamEditor`

**Phase** 2 · **Depends on** PNJ-025 copy or reimplement matchup  
**Read first:** [`docs/04-workflows/player-assignment.md`](../docs/04-workflows/player-assignment.md)  
**Create:** `apps/admin/src/modules/playmates/game-team-editor/*`  

`"use client"`. Two zones Team 1 / Team 2. Props: `{ roster: { id, displayName }[]; team1: string[]; team2: string[]; onChange(next) }`. Actions: add from roster select, remove, swap teams, clear team. **Copy previous** is a button that calls `onCopyPrevious` — parent implements. Stories: empty, doubles, singles.

Do not infer teams from sides.

---

### PNJ-031 — `UploadProviderStatus`

**Phase** 2 · **Depends on** PNJ-038 · **Size** S  
**Create:** `apps/admin/src/modules/playmates/upload-provider-status/*`  

Props: `{ provider: "google_drive" | "youtube"; status: UploadJobStatus; progressPercent?: number; errorMessage?: string }`. Show Progress from `@fe-template/ui` when uploading. Failed: destructive badge + error text.

---

### PNJ-032 — `UploadQueue`

**Phase** 2 · **Depends on** PNJ-031 · **Size** S  
**Create:** `apps/admin/src/modules/playmates/upload-queue/*`  

List of recordings with stacked provider statuses. Props: `{ items: { recordingLabel, drive, youtube }[] }`.

---

### PNJ-033 — `UploadMatrix`

**Phase** 2 · **Depends on** PNJ-031 · **Size** S  
**Read first:** admin Upload screen table  
**Create:** `apps/admin/src/modules/playmates/upload-matrix/*`  

Use `DataTable` **or** a simple table via `@fe-template/ui`. Columns: Recording | Drive | YouTube. Do not hide failed cells.

---

### PNJ-034 — `FacebookPostPreview`

**Phase** 2 · **Depends on** none · **Size** S  
**Create:** `apps/admin/src/modules/playmates/facebook-post-preview/*`  

Props: `{ title?, body, onChange?, onCopy }`. Textarea + Copy button. Copy uses `navigator.clipboard.writeText`. Stories: generated body, empty.

---

### PNJ-035 — `SessionPublishChecklist`

**Phase** 2 · **Depends on** PNJ-038 · **Size** S  
**Create:** `apps/admin/src/modules/playmates/session-publish-checklist/*`  

One row/card per game: matchup, youtube state, drive state, visibility, warning if a provider missing. Props: `{ games: [...]; onPublishGame; onPublishAll }`. Warning is visible, not a blocker.

---

## Phase 2 exit checklist

- [ ] JabKit atoms + marketing installed pristine
- [ ] Public cards exist with meta.ts + stories
- [ ] Admin workspace widgets exist (board presentational, no DnD yet)
- [ ] No Playmates widgets added to `packages/ui`
