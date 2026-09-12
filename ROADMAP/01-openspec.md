# OpenSpec — init and capability specs

Use the real CLI: **`@fission-ai/openspec`**. Do not run `npx openspec` (unscoped `openspec` on npm is `0.0.0` and is the wrong package).

Docs: [OpenSpec getting started](https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md), [concepts](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md).

## Target tree after this phase

```text
openspec/
├── config.yaml
├── specs/
│   ├── session-management/spec.md
│   ├── player-management/spec.md
│   ├── venue-management/spec.md
│   ├── game-and-team-management/spec.md
│   ├── recording-import/spec.md
│   ├── recording-organization/spec.md
│   ├── provider-upload/spec.md
│   ├── publishing/spec.md
│   ├── facebook-post-drafting/spec.md
│   └── public-archive-browsing/spec.md
└── changes/
    └── bootstrap-playmates-prototype/
        ├── .openspec.yaml
        ├── proposal.md
        ├── design.md
        ├── tasks.md
        └── specs/
            └── <same 10 capability folders>/spec.md   # ADDED Requirements
```

Main specs under `openspec/specs/` describe **intended current behavior of the prototype**. Because we start from a template with no Playmates behavior, the bootstrap change is all **ADDED** requirements. After the change is archived (optional, later), those ADDED blocks become the main specs. For this roadmap it is enough to:

1. `init`
2. Create the bootstrap change with delta specs
3. Copy the same requirements into `openspec/specs/<capability>/spec.md` as the living source of truth so implementers can read them without opening the change folder

If `openspec validate` complains that main specs and deltas duplicate, keep deltas in the change and main specs as the post-archive truth. Prefer whatever `openspec validate --strict` accepts.

---

### PNJ-002 — Initialize OpenSpec in the repo

**Phase** 0 · **Depends on** none · **Size** S  
**Read first:** this file, https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md  
**Create:** `openspec/` (tool-generated), plus a one-line pointer in root `AGENTS.md` under documentation routing  
**Edit:** none besides the pointer  
**Delete:** none  
**Do not touch:** `apps/`, `packages/`, product docs  

**Steps:**

1. From the **repository root** run:

   ```bash
   npx @fission-ai/openspec@latest init
   ```

2. Accept defaults that put specs in `./openspec`. If the tool asks for a schema, choose **spec-driven**.
3. Confirm `openspec/` exists. Do not invent a second `specs/` folder at repo root.
4. Add this row to the root [`AGENTS.md`](../AGENTS.md) routing table (or a short “OpenSpec” bullet under documentation):

   | Task type | Read first |
   |---|---|
   | Playmates capability behavior | `openspec/specs/<capability>/spec.md` then `docs/01-product/` |

5. Record the exact CLI version in `openspec/config.yaml` comments or `ROADMAP/` is already the record — do not create extra markdown.

**Acceptance:**

- `npx @fission-ai/openspec@latest --version` works from the repo.
- `openspec/` exists and is not empty.
- Root `AGENTS.md` mentions `openspec/specs`.

**Validate:** `pnpm lint` (markdown/layout only; ignore if AGENTS is not linted).

---

### PNJ-003 — Author the 10 capability specs + bootstrap change

**Phase** 0 · **Depends on** PNJ-002 · **Size** L  
**Read first:** [`docs/01-product/business-rules.md`](../docs/01-product/business-rules.md), [`docs/08-implementation/mvp-acceptance-criteria.md`](../docs/08-implementation/mvp-acceptance-criteria.md), [`docs/07-engineering/state-machines.md`](../docs/07-engineering/state-machines.md), this file  
**Create:** the 10 `openspec/specs/*/spec.md` files and `openspec/changes/bootstrap-playmates-prototype/**`  
**Edit:** none of the app source  
**Delete:** none  
**Do not touch:** Prisma, apps, packages  

**Steps:**

1. Create the change:

   ```bash
   npx @fission-ai/openspec@latest new change "bootstrap-playmates-prototype"
   ```

   If the CLI needs a different identifier format, keep kebab-case `bootstrap-playmates-prototype`.

2. Fill `proposal.md`:

   - **Why:** replace PawPair template UI with a mock-backed Playmates archive + admin workspace.
   - **Scope:** pages, components, `packages/mocks`. No real DB, no real Google APIs.
   - **New capabilities:** the 10 names below.
   - **Modified capabilities:** none.

3. Write `design.md` in 1–2 pages: hybrid UI, in-memory repo, `MOCK_AUTH`, admin routes without `/admin` prefix. Point at `ROADMAP/00-conventions.md`.

4. Write `tasks.md` as a short checklist that points at `ROADMAP/99-ticket-index.md` — do not duplicate every PNJ ticket.

5. For each capability, write `openspec/specs/<name>/spec.md` **and** the matching delta under the change as `## ADDED Requirements`.

6. Every requirement MUST include at least one `#### Scenario:` with WHEN / THEN (OpenSpec validate needs this).

7. Run:

   ```bash
   npx @fission-ai/openspec@latest validate bootstrap-playmates-prototype --strict
   ```

   Fix formatting until it passes.

**Acceptance:**

- Ten capability folders exist.
- `validate --strict` passes.
- Each spec below is covered (do not drop a requirement to make validate pass — fix the syntax).

**Validate:** OpenSpec validate command above.

---

## Capability skeletons (copy into spec.md)

Use this heading style:

```markdown
# <Capability title>

## Purpose
<one paragraph>

## Requirements

### Requirement: <short name>
The system SHALL ...

#### Scenario: <name>
- WHEN <actor does x>
- THEN <system does y>
```

Delta files wrap the same requirements in `## ADDED Requirements`.

---

### 1. `session-management`

Purpose: A session is one play date. It is the admin workspace root and the public archive folder.

Trace: `docs/02-domain/session-model.md`, `docs/01-product/business-rules.md` (Sessions).

Requirements to include:

- Session requires a `session_date`. Title, venue, court, notes are optional.
- Status is one of: `draft`, `organizing`, `uploading`, `ready`, `published`, `archived`. Status is convenience, not the only source of truth for uploads.
- Visibility is `private` | `public`. Default `private`.
- Slug is unique. Default slug is ISO date `YYYY-MM-DD`; collisions get a suffix.
- Session may exist with zero games and zero recordings.
- Session players live in a join table, not a JSON array.
- Soft workflow: creating a session does not publish it.

Scenarios: create Sep 9 2026 session; create session without venue; cannot create without date; published_at set only on publish.

---

### 2. `player-management`

Trace: business rules Players.

- Display name is required. Facebook name/URL optional.
- Slug unique, derived from display name, collision suffix.
- `is_archived` instead of hard delete when the player appears on any game or session roster.
- A player may be on a session roster without appearing in every game.

Scenarios: add player with only a name; archive player with history; archived players hidden from default pickers but still render on old games.

---

### 3. `venue-management`

- Name required. Address/notes optional. Slug unique.
- A venue has zero or more courts (`name`, `sort_order`, `is_archived`).
- Session.venue_id and session.court_id are optional. If court is set, it MUST belong to the selected venue.

Scenarios: create venue + two courts; assign court from another venue is rejected; session with no venue is allowed.

---

### 4. `game-and-team-management`

Trace: `docs/02-domain/game-and-team-model.md`.

- Game belongs to one session. `game_number` unique per session. `sort_order` explicit; games can be reordered.
- A game may have zero recordings and unset players.
- Two `game_teams` per normal game (`team_no` 1 and 2). Players hang off `game_team_players`, never fixed `player_1` columns.
- Matchup display: `José & Carlo vs Mika & Marco`. If empty: `Team 1 vs Team 2`.
- Camera side MUST NOT infer team.
- Winner optional (`winner_team_no`).
- Visibility independent of session, but public game pages require the game (and typically the session) to be public — see publishing.

Scenarios: create 10 games; reorder game 10 to position 3 and renumber display; singles (one player per team); empty matchup label.

---

### 5. `recording-import`

Trace: `docs/02-domain/recording-model.md`, `docs/04-workflows/import-and-pairing.md`.

- Import captures: original filename, mime, size, lastModified, optional duration.
- Each recording gets a stable UUID. Filename is not identity. Duplicate names are allowed.
- `game_id` nullable. `camera_side` default `UNASSIGNED`. `part_number` default 1.
- Metadata persists immediately in the mock store. The browser `File` is **not** persisted.
- After reload, UI MUST say the local file must be reselected if an upload still needs bytes.

Scenarios: drop 21 files → 21 rows; two files named `IMG_1001.MOV` both stored; refresh loses File handles and shows reselect.

---

### 6. `recording-organization`

Trace: admin organize screen, ADR-002.

- Admin can create games, assign recording → game, set side `A` | `B` | `UNASSIGNED`, reorder parts.
- Part numbers are scoped to `(game_id, camera_side)` and MUST auto-normalize to 1..n after move.
- The system MUST NOT reject: one side missing; three parts on one side; zero recordings on a game.
- Unassigned area is valid.
- Suggestions (timestamp pairing) if implemented later MUST be visibly optional. Not required for prototype.

Scenarios: Game 4 Side B two parts; Game 8 one recording; move clip between games; leave clip unassigned.

---

### 7. `provider-upload`

Trace: ADR-001, ADR-004, state-machines, retry-and-recovery.

- Providers: `google_drive`, `youtube`. Jobs are independent.
- Job status: `queued` → `initiating` → `uploading` → `processing` → `completed`, or `failed` / `cancelled`. Retry: `failed|cancelled` → `queued`.
- Prototype **simulates** progress. No bytes leave the machine.
- Retry YouTube MUST NOT reset a completed Drive job.
- If a completed `provider_asset` exists, starting another upload requires explicit replace.
- Reselect local file when handle missing.

Scenarios: Drive complete + YouTube fail → retry YouTube only; cancel in-flight; failed job shows error copy + retry.

---

### 8. `publishing`

Trace: business rules Publication.

- Publish is explicit. Uploads completing do not auto-publish.
- Admin MAY publish a game with only YouTube, only Drive, both, or neither. UI warns when a provider is missing; it does not hard-fail.
- Session `visibility=public` + `published_at` makes the session listable. Individual games have their own visibility.
- Public site shows only `visibility=public` records.
- Unpublish returns to private and hides from public lists.

Scenarios: publish session with one game missing YouTube after dismissible warning; unpublish hides it; draft session never appears on `/sessions`.

---

### 9. `facebook-post-drafting`

Trace: ADR-003, naming conventions.

- One `post_draft` per game (platform `facebook_group`), versioned if edited.
- Body includes: game label, player names, YouTube URLs, Drive URLs, optional notes, optional hashtags.
- Admin can edit and save. Copy button copies current body.
- Optional “mark posted” + optional post URL. The app NEVER posts to Facebook.

Scenarios: generate draft after matchup+links exist; copy to clipboard; edit persists version increment.

---

### 10. `public-archive-browsing`

Trace: `docs/06-ui/public-site.md`.

- Routes: `/`, `/sessions`, `/sessions/[sessionSlug]`, `/games/[gameSlug]`, `/players`, `/players/[playerSlug]`, `/venues`, `/venues/[venueSlug]`.
- Home shows latest public sessions and recent public games — not a dating-app landing page.
- Session filters: date, player, venue (client-side on mocks is fine).
- Game page: matchup, date/venue, ordered recordings, YouTube embed when `embed_url` exists, Drive links, prev/next game in the same session.
- Player page: name, recent public sessions/games. No stats required.
- Venue page: name, public session history.
- 404 for unknown slug or private slug (do not leak that a private session exists if easy — returning 404 is preferred).

Scenarios: visitor sees Sep 9 published session; visitor cannot open a draft session slug; game with two Side B parts shows Part 1 then Part 2.

---

## Mapping capabilities → later tickets

| Capability | First implementing tickets |
|---|---|
| session-management | PNJ-057, PNJ-058, PNJ-061 |
| player-management | PNJ-055, PNJ-062 |
| venue-management | PNJ-056 |
| game-and-team-management | PNJ-067, PNJ-069 |
| recording-import | PNJ-063 |
| recording-organization | PNJ-064–PNJ-068 |
| provider-upload | PNJ-072, PNJ-073 |
| publishing | PNJ-074, PNJ-076 |
| facebook-post-drafting | PNJ-075 |
| public-archive-browsing | PNJ-043–PNJ-051 |
