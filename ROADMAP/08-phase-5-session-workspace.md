# Phase 5 — Session workspace (7 steps)

Goal: `/sessions/[id]` is a multi-step workspace, not a pile of CRUD forms.

Read first: [`docs/06-ui/admin-session-workspace.md`](../docs/06-ui/admin-session-workspace.md), [`docs/04-workflows/session-to-publish.md`](../docs/04-workflows/session-to-publish.md), [`docs/04-workflows/import-and-pairing.md`](../docs/04-workflows/import-and-pairing.md), [`docs/04-workflows/player-assignment.md`](../docs/04-workflows/player-assignment.md).

Route map (all under `apps/admin/src/app/(dashboard)/sessions/[id]/`):

```text
page.tsx                  → redirect to /details
details/page.tsx
players/page.tsx
import/page.tsx
organize/page.tsx
matchups/page.tsx
upload/page.tsx
publish/page.tsx           # Review & Publish
layout.tsx                # header + stepper
```

IA also listed `/import` `/organize` `/publish` — match those. Extra steps Details / Players / Matchups / Upload are required by the workspace doc.

Use components from Phase 2. Upload **simulation** and Facebook generate are Phase 6; this phase builds the UI and wires organize/matchup mutations.

**DnD library:** `@dnd-kit/core` + `@dnd-kit/sortable` added **only** to `apps/admin` in PNJ-065. Do not add it to web.

---

### PNJ-060 — Workspace shell, layout, stepper, redirect

**Phase** 5 · **Depends on** PNJ-036, PNJ-037, PNJ-057 · **Size** M  
**Create:** `sessions/[id]/layout.tsx`, `page.tsx`, empty step pages that render `<p>TODO</p>` if the real step ticket is later  
**Edit:** none  

**Steps:**

1. `layout.tsx` is a server component: load `sessions.getById(id)`, `notFound()` if missing. Render `SessionWorkspaceHeader` + `SessionWorkspaceStepper` + `{children}`.
2. Step hrefs: `/sessions/${id}/details` … `/publish`.
3. `page.tsx` `redirect` to `details`.
4. Header saveState: `"saved"` for now.
5. Create the seven step folders with placeholder headings so links work.

**Acceptance:** Opening a session from the list shows header (Sep 9 date) and seven step links. Each placeholder route 200s.

**Validate:** admin typecheck + browser.

---

### PNJ-061 — Step: Details

**Phase** 5 · **Depends on** PNJ-060, PNJ-058 form patterns · **Size** M  
**Create:** `sessions/[id]/details/page.tsx` + `details-form/*`  

**Steps:**

1. Same fields as create: date, title, venue, court (filtered), notes, plus visibility select (private/public) and status **display** (read-only badge — status changes via workflow later, but allow a select for prototype convenience: draft/organizing/…).
2. Submit `sessions.update`. `revalidatePath`.
3. Show slug (read-only).

**Acceptance:** Change title, refresh, title persists.

**Validate:** admin typecheck + browser.

---

### PNJ-062 — Step: Players (session roster)

**Phase** 5 · **Depends on** PNJ-055, PNJ-060 · **Size** M  
**Create:** `sessions/[id]/players/page.tsx` + roster editor  

**Steps:**

1. Multi-select / checkbox list of non-archived players. Selected = session roster.
2. `+ Add new player` opens the same create dialog as PNJ-055, then adds the new id to the roster.
3. Save calls `sessions.setRoster`.
4. Helper text: “Game pickers use this roster.”

**Acceptance:** Add/remove Carlo, refresh, roster matches.

**Validate:** admin typecheck + browser.

---

### PNJ-063 — Step: Import

**Phase** 5 · **Depends on** PNJ-027, PNJ-060 · **Size** L  
**Read first:** recording-import OpenSpec, recording-model local file lifecycle  
**Create:** `sessions/[id]/import/page.tsx` + client importer  

**Steps:**

1. Render `RecordingDropzone`. On files chosen:
   - Build `ImportFileMeta[]` from each `File`.
   - Keep `File` objects in **React state** (`Map<recordingId, File>`) — they are not sent to the server.
   - Call `recordings.createMany(sessionId, metas)` via Server Action. Return created rows.
2. Table of imported recordings: filename, size, mime, lastModified, assigned game/side (probably unassigned).
3. Validation errors: reject non-video mime with a row-level error, still import others.
4. Banner: “These files exist only in this browser tab. Refreshing requires reselecting files before a real upload.”
5. After refresh, metadata rows remain (mock store); File map is empty → show “Reselect” on each row (input per row). Reselect stores File in client state again. Do not hash-compare unless easy; match by filename+size as a hint, allow manual pick.

**Acceptance:** Drop 3 dummy video files (or any files named `.mp4` in local testing — if the OS has no video, temporarily accept any file in dev with a console warn). 3 rows appear. Full page refresh: 3 rows remain, reselect banner shows.

**Validate:** admin typecheck + browser drop + refresh.

---

## Organize board — five tickets (do not merge)

The board is the hardest UX. Each ticket must ship a clickable increment.

---

### PNJ-064 — Organize: layout + static board from store

**Phase** 5 · **Depends on** PNJ-029, PNJ-060 · **Size** M  
**Create:** `sessions/[id]/organize/page.tsx` + client wrapper that maps repo data → `GameRecordingBoard` props  

**Steps:**

1. Load recordings + games for the session.
2. Partition: `gameId == null` or `cameraSide == UNASSIGNED` → unassigned column (if game set but side unassigned, still show in unassigned **or** under the game in an “unassigned side” bucket — pick **unassigned column** for UNASSIGNED side).
3. Render presentational `GameRecordingBoard`.
4. Buttons (no-op or linked): “Add game” disabled until PNJ-067 if you want — prefer enabling via PNJ-067 same week.
5. Desktop two-column; mobile stack.

**Acceptance:** Sep 9 session shows 10 games and 21 cards in the right lanes (already organized in seed). A new empty session shows empty unassigned + zero games.

**Validate:** admin typecheck + browser Sep 9.

---

### PNJ-065 — Organize: drag assign to game/side

**Phase** 5 · **Depends on** PNJ-064 · **Size** L  
**Create:** DnD wiring in `apps/admin/src/modules/playmates/game-recording-board/`  
**Edit:** `apps/admin/package.json` via `pnpm --filter admin add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`  

**Steps:**

1. Install the three dnd-kit packages on **admin only**.
2. Each `RecordingCard` is `useDraggable`. Each `CameraSideLane` and the unassigned column is `useDroppable` with id `unassigned` or `game:${id}:A` / `game:${id}:B`.
3. On drag end, Server Action `assignRecording(recordingId, { gameId, cameraSide })`.
4. Optimistic UI optional; must revalidate and show the card in the new lane after action.
5. Keyboard: cards are focusable; if dnd-kit keyboard sensor is easy, enable it. If not, add “Move to…” `Select` on the card as fallback — **required** so the feature works without a mouse.

**Acceptance:** Drag IMG from Game 1 Side A to Game 2 Side B. After drop, it lives there. Select fallback can do the same.

**Validate:** admin typecheck + browser drag.

---

### PNJ-066 — Organize: part numbers and reorder within a lane

**Phase** 5 · **Depends on** PNJ-065 · **Size** M  

**Steps:**

1. After every assign, call `normalizeParts(gameId, side)` so parts are 1..n by `sort_order`.
2. Within a lane, `@dnd-kit/sortable` reorder updates `sort_order` then normalize.
3. `displayName` refresh using `formatRecordingDisplayName` (include Part only when n>1).
4. Game 4 Side B must show Part 1 / Part 2 after reorder.

**Acceptance:** Two clips in Side B labeled Part 1 and Part 2. Reorder swaps labels. Moving one away leaves the remaining as no-part or Part 1 only per naming rules.

**Validate:** admin typecheck + browser on Sep 9 game 4.

---

### PNJ-067 — Organize: create / delete empty games, merge not required

**Phase** 5 · **Depends on** PNJ-064 · **Size** S  

**Steps:**

1. “Add game” → `games.create(sessionId)` → new empty Game N with two empty lanes.
2. “Remove game” only if the game has zero recordings; otherwise ask to move recordings first (AlertDialog).
3. Split/merge grouping: **out of scope**. Moving cards is enough.

**Acceptance:** On an empty session, add Game 1 and Game 2. Remove Game 2 if empty.

**Validate:** admin typecheck + browser.

---

### PNJ-068 — Organize: persist + status bump

**Phase** 5 · **Depends on** PNJ-065, PNJ-066, PNJ-067 · **Size** S  

**Steps:**

1. After any successful organize mutation, if session.status is `draft`, set status to `organizing`.
2. Recording status → `organized` when `gameId` and side are set.
3. Unassigned recordings stay `imported`.
4. Header saveState flickers `saving` → `saved` (client).

**Acceptance:** New session after first assign is `organizing`. Refresh keeps assignments.

**Validate:** admin typecheck + browser.

---

### PNJ-069 — Step: Matchups

**Phase** 5 · **Depends on** PNJ-030, PNJ-062 · **Size** L  
**Create:** `sessions/[id]/matchups/page.tsx`  

**Steps:**

1. List games in order. Each row is `GameTeamEditor` bound to that game.
2. Roster = session players. If roster empty, show link back to Players step.
3. `onChange` → `games.setTeams`.
4. Buttons: Swap, Clear, **Copy previous matchup** (copy teams from game_number-1).
5. Optional winner select (team 1 / team 2 / unset).
6. Do not use camera sides.

**Acceptance:** Set Game 1 to José+Carlo vs Mika+Marco. Copy onto Game 2. Refresh persists. Side A remaining unchanged.

**Validate:** admin typecheck + browser.

---

### PNJ-070 — Step: Upload (UI only)

**Phase** 5 · **Depends on** PNJ-033, PNJ-032, PNJ-060 · **Size** M  
**Create:** `sessions/[id]/upload/page.tsx`  

**Steps:**

1. Render `UploadMatrix` + `UploadQueue` from current jobs (likely empty or completed seed jobs).
2. Buttons “Queue Drive”, “Queue YouTube”, “Queue both” **disabled** with tooltip “Wired in next phase” **or** call enqueue if PNJ-072 is already done. Prefer wiring to `uploads.enqueue` if the repo method exists — then this ticket may depend on PNJ-072. **Official dependency:** implement UI here; if enqueue exists, connect it. If not, leave handlers as `console.warn` and PNJ-072 connects them.
3. Show the reselect banner when client File map is empty but incomplete jobs exist.

**Acceptance:** Page renders a matrix for all recordings in the session. Sep 9 shows completed-looking rows if seed created completed jobs/assets.

**Validate:** admin typecheck + browser.

---

### PNJ-071 — Step: Review & Publish (UI)

**Phase** 5 · **Depends on** PNJ-034, PNJ-035, PNJ-060 · **Size** M  
**Create:** `sessions/[id]/publish/page.tsx`  

**Steps:**

1. `SessionPublishChecklist` for all games.
2. Each game shows `FacebookPostPreview` with existing draft body or placeholder “Generate in next phase”.
3. Publish buttons: if `publish.publishGame` exists, call it; else no-op until PNJ-074.
4. Warnings visible when a provider asset is missing.

**Acceptance:** Sep 9 checklist shows 10 games. At least one warning if seed left a YouTube gap.

**Validate:** admin typecheck + browser.

---

## Phase 5 exit checklist

- [ ] Seven steps navigable
- [ ] Import persists metadata across refresh
- [ ] Drag (or select) assign works; parts normalize
- [ ] Matchups persist; copy previous works
- [ ] Upload/Publish screens exist (live jobs/publish may land in Phase 6)
