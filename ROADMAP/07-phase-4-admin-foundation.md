# Phase 4 — Admin foundation (CRUD + dashboard)

Goal: José can log in (or bypass), see a dashboard, manage players/venues, list/create sessions. The session **workspace** is Phase 5.

Admin origin has **no** `/admin` prefix. IA `/admin/sessions` → `apps/admin` `/sessions`.

Patterns to copy (structure only — those pages were deleted):

```text
apps/admin/src/app/(dashboard)/<entity>/
  page.tsx
  actions.ts
  <entity>-table/
  <entity>-dialog/
    <form>/<Form>.tsx
    <form>/<Form>.schema.ts
    <form>/<Form>.defaults.ts
```

Use `@fe-template/ui` `DataTable`, `Form`, `Dialog`, `Button`, `Empty`, `Skeleton`. No JabKit.

Server Actions call `getPlaymatesRepos()` from `@fe-template/mocks`. Zod-validate inputs. `revalidatePath` after writes.

Hooks optional: `apps/admin/src/hooks/use-players/` etc. RSC pages may call repos directly.

---

### PNJ-053 — Sidebar and dashboard chrome for Playmates

**Phase** 4 · **Depends on** PNJ-006, PNJ-007 · **Size** S  
**Edit:** `AdminSidebar.tsx`, `(dashboard)/layout.tsx`  
**Create:** none  

**Steps:**

1. `NAV_ITEMS` in this exact order (IA nav priorities):

   | href | label |
   |---|---|
   | `/dashboard` | Dashboard |
   | `/sessions` | Sessions |
   | `/players` | Players |
   | `/venues` | Venues |
   | `/settings` | Settings |

2. Footer of sidebar: profile name from mock user + link `/profile` if that page still exists; else omit.
3. `TITLES` map complete (see [`02-metadata.md`](02-metadata.md)).
4. Do not add Uploads as a top-level route; unfinished uploads live on the dashboard + session workspace.

**Acceptance:** Sidebar shows five items. Brand “Playmates Admin”.

**Validate:** admin typecheck.

---

### PNJ-054 — Dashboard widgets

**Phase** 4 · **Depends on** PNJ-018, PNJ-038, PNJ-053 · **Size** M  
**Read first:** [`docs/06-ui/information-architecture.md`](../docs/06-ui/information-architecture.md) Admin dashboard  
**Create:** `apps/admin/src/app/(dashboard)/dashboard/page.tsx` + widgets under `apps/admin/src/modules/playmates/dashboard/`  

**Steps:**

RSC page loads repos and renders:

1. **Latest sessions** — 5 rows: date, status, visibility, link to workspace `/sessions/[id]`.
2. **Unfinished uploads** — jobs not completed/cancelled. Empty state OK on a fresh seed (published session is done). Use the draft session or enqueue nothing — show Empty “All uploads finished”.
3. **Failed jobs** — list with error code.
4. **Awaiting Facebook** — public games whose post draft is not `markPosted`. Seed drafts are unposted → this list should be non-empty for Sep 9.
5. **Quick create** — button to `/sessions/new`.

Desktop: 2×2 grid + full-width latest sessions. Mobile: stack.

**Acceptance:** Dashboard renders with seed data. Quick create link works (page may 404 until PNJ-058).

**Validate:** admin typecheck. Browser `/dashboard` with `MOCK_AUTH=true`.

---

### PNJ-055 — Players CRUD

**Phase** 4 · **Depends on** PNJ-018, PNJ-053 · **Size** L  
**Read first:** player-management OpenSpec, business rules Players  
**Create:** `apps/admin/src/app/(dashboard)/players/**`  

**Steps:**

1. List page: `DataTable` columns displayName, nickname, slug, archived, games count (optional). Search box filters client-side.
2. Dialog create: only `displayName` required. Optional nickname, facebookName, facebookUrl, notes. Zod schema.
3. Dialog edit: same fields.
4. Archive action with confirm (`AlertDialog`). No hard delete.
5. `actions.ts`: `createPlayer`, `updatePlayer`, `archivePlayer`.
6. Detail route `/players/[id]` optional; a dialog is enough for MVP. If you add detail, keep it thin.
7. Inline “+ Add new player” used later by the workspace must call the same `createPlayer` action — export it.

**Acceptance:** Create “Test Player”, see them in the table after submit, archive them, default list hides archived unless a toggle “Show archived” is on.

**Validate:** admin typecheck + browser CRUD.

---

### PNJ-056 — Venues and courts CRUD

**Phase** 4 · **Depends on** PNJ-018, PNJ-053 · **Size** L  
**Create:** `apps/admin/src/app/(dashboard)/venues/**`  

**Steps:**

1. Venue table: name, slug, court count, archived.
2. Create/edit venue dialog.
3. Venue detail `/venues/[id]`: list courts, add court (name), archive court.
4. Actions validate unique names lightly (case-insensitive) — warn, don’t have to be unique globally.
5. Do not allow picking a court on a session that belongs to another venue (enforced in session actions PNJ-058).

**Acceptance:** Create venue “Home Gym”, add Court 1 and Court 2, see them after reload (same Node process).

**Validate:** admin typecheck + browser.

---

### PNJ-057 — Sessions list

**Phase** 4 · **Depends on** PNJ-018, PNJ-038, PNJ-053 · **Size** M  
**Create:** `apps/admin/src/app/(dashboard)/sessions/page.tsx` + table  

**Steps:**

1. Columns: date, title, venue, status, visibility, game count, actions “Open”.
2. Open → `/sessions/[id]` (workspace, Phase 5). Until workspace exists, Open may 404 — land on a stub in this ticket:

   Create `apps/admin/src/app/(dashboard)/sessions/[id]/page.tsx` that shows session date + “Workspace incoming” **or** wait for PNJ-060. Prefer a stub so the list is clickable.

3. Filter chips: all / draft / published.

**Acceptance:** Sep 9 and the draft session both visible to admin (admin sees private).

**Validate:** admin typecheck + browser.

---

### PNJ-058 — Create session `/sessions/new`

**Phase** 4 · **Depends on** PNJ-055, PNJ-056, PNJ-057 · **Size** M  
**Read first:** session-to-publish Phase 1  
**Create:** `apps/admin/src/app/(dashboard)/sessions/new/page.tsx` + form module  

**Steps:**

1. Fields: `sessionDate` (required, `<input type="date">`), title, venue select, court select (filtered by venue; disabled until venue), notes.
2. Roster multi-select of non-archived players (can be empty at create; Phase 5 step Players).
3. Zod: date required. If courtId set, court must belong to venueId — validate in action using repos.
4. On success `redirect(/sessions/${id})`.
5. Defaults: date = today (local), venue empty.

**Acceptance:** Create `2026-09-12` session, appear in list, mock store has it after navigation.

**Validate:** admin typecheck + browser submit.

---

### PNJ-059 — Settings placeholders

**Phase** 4 · **Depends on** PNJ-053 · **Size** S  
**Create:**  
- `apps/admin/src/app/(dashboard)/settings/page.tsx`  
- `settings/google/page.tsx`  
- `settings/publishing/page.tsx`  

**Steps:**

1. Settings index links to Google and Publishing.
2. Google page: copy “OAuth will be wired later” + disabled “Connect Google” button. Do **not** implement OAuth.
3. Publishing page: fields stored **only in mock memory or local module constants**: Facebook Group URL (text), default hashtags (`#PlaymatesNiJose #Badminton`). Save to `getState().settings` if you add a `settings` bag on the mock store (allowed). These strings are used by Facebook body generator.

**Acceptance:** Pages render. Connect Google does nothing but is visible.

**Validate:** admin typecheck.

---

## Phase 4 exit checklist

- [ ] Sidebar IA complete
- [ ] Dashboard widgets read mocks
- [ ] Players and venues CRUD persist in-memory
- [ ] Sessions list + create
- [ ] Settings are placeholders, no OAuth
