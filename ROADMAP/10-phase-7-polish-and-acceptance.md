# Phase 7 — Polish and MVP acceptance

Goal: the prototype feels like a product, not a pile of tickets. Then walk the official 20-step scenario.

---

### PNJ-077 — Empty, loading, error states

**Phase** 7 · **Depends on** PNJ-043–PNJ-050, PNJ-054–PNJ-071 · **Size** M  
**Read first:** [`docs/frontend-conventions.md`](../docs/frontend-conventions.md) loading/empty/error  

**Steps:**

1. Every list (public grids, admin tables, dashboard widgets, unassigned column) uses `@fe-template/ui` `Empty` when length 0.
2. Admin tables: `Skeleton` rows while… (RSC has no loading if data is sync — add `loading.tsx` siblings under `players`, `venues`, `sessions` with skeletons).
3. Server Action errors: `sonner` toast, do not crash the page.
4. Public `not-found.tsx` copy is Playmates, links Home + Sessions.
5. Admin `error.tsx` already exists — ensure it does not say PawPair.

**Acceptance:** `/sessions?venue=nope` empty state (or filter with no matches). `/players` loading.tsx exists.

**Validate:** `pnpm lint && pnpm typecheck`

---

### PNJ-078 — Storybook coverage pass

**Phase** 7 · **Depends on** Phase 2 components existing · **Size** M  

**Steps:**

1. Every domain component from Phase 2 has at least two stories + a dark story (or Theme decorator).
2. Web sections added in Phase 3 have stories with mock props (no need to boot the memory store).
3. `pnpm --filter web storybook` and `pnpm --filter admin storybook` start without import errors.
4. Do not add Chromatic or visual snapshot infra.

**Acceptance:** No missing-story domain component from the Phase 2 list. Grep folders for `.stories.tsx`.

**Validate:** storybook start (agent checks compile). typecheck.

---

### PNJ-079 — Responsive and a11y pass

**Phase** 7 · **Depends on** all UI tickets · **Size** M  

**Steps:**

1. Public pages at 375 and 1280: no horizontal scroll, tap targets ≥ 40px on nav.
2. Admin workspace is **desktop-first**. At 375, organize board stacks; do not spend time making drag perfect on mobile. Header must not overflow.
3. Images have alt. Iframes have title. Buttons have accessible names (“Copy Facebook post”, not “Copy”).
4. `prefers-reduced-motion`: JabKit motion / count-up / split-text respect it or are hidden.
5. Focus visible on stepper links.

**Acceptance:** Checklist above verified in browser tools at two viewports on `/`, `/sessions/2026-09-09`, `/games/2026-09-09-game-4`, admin organize.

**Validate:** browser pass. `pnpm lint`

---

### PNJ-080 — MVP acceptance walkthrough (literal script)

**Phase** 7 · **Depends on** PNJ-076, PNJ-077 · **Size** L  
**Read first:** [`docs/08-implementation/mvp-acceptance-criteria.md`](../docs/08-implementation/mvp-acceptance-criteria.md)  

This ticket is **verification**, not new features. File bugs as follow-up only if a listed step fails; fix blockers in this ticket if they are small.

**Create:** `ROADMAP/ACCEPTANCE-LOG.md` filled by the implementing agent with PASS/FAIL per step.

**Script** (do in order):

| # | Action | Expected |
|---|---|---|
| 1 | `MOCK_AUTH=true` `pnpm --filter admin dev` → open `/dashboard` | Dashboard, no login wall |
| 2 | Sessions → New → date `2026-09-09` if that slug is taken use `2026-09-16` | Session exists. **If using 2026-09-16, still create 10 games / 21 files as below.** The official date is Sep 9; if seed already used it, **either** `resetState()` / delete `store.json` **or** walk the seed session for organize/publish and only test “create” on 2026-09-16. Prefer: wipe `packages/mocks/.data/store.json`, restart both servers, use seed Sep 9 for public and a **new** `2026-09-16` for the full create→publish path. |
| 3 | Set venue Smash Court | Saved |
| 4 | Roster all 8 seed players | Saved |
| 5 | Import 21 files (any files renamed to `.mp4` is OK for prototype). Include two parts for “game 4 side B” and only one file you will put on game 8 | 21 metadata rows |
| 6 | Organize into 10 games | 10 games |
| 7 | Game 4 Side B has two parts | Labels Part 1 / Part 2 |
| 8 | Game 8 has exactly one recording | No error toast |
| 9 | Assign matchups on all 10 | Labels show names |
| 10 | Review generated titles on upload/publish (Drive filename + YouTube title functions used in drafts) | Strings match naming doc |
| 11 | Queue all Drive | Jobs complete; fake Drive URLs |
| 12 | Queue all YouTube | Jobs complete except optional FAIL file |
| 13 | Progress visible while running | Progress > 0 before 100 |
| 14 | Force YouTube fail on one file, retry | Drive still complete |
| 15 | Provider URLs in mock store / UI | Visible on publish cards |
| 16 | Confirm no video bytes in `packages/mocks/.data/store.json` | JSON has metadata only |
| 17 | Publish session + games | visibility public |
| 18 | `pnpm --filter web dev` → `/sessions/<slug>` | Visitors see games |
| 19 | Each game Facebook draft exists | Body has names + links |
| 20 | Copy button | Clipboard has the body |

Non-functional:

- Admin usable at 1280px.
- Public usable at 375px.
- No OAuth token in client payloads (there are none).
- `pnpm lint && pnpm typecheck` pass.

**Acceptance:** `ROADMAP/ACCEPTANCE-LOG.md` has 20 PASS lines **or** FAIL with a bug note. Prototype is demoable.

**Validate:** the table above.

---

### PNJ-081 — Docs sweep after the prototype exists

**Phase** 7 · **Depends on** PNJ-080 · **Size** S  
**Edit:** `AGENTS.md`, `apps/web/AGENTS.md`, `apps/web/docs/README.md`, `apps/admin/AGENTS.md`, `apps/admin/docs/README.md`, `packages/mocks/docs/README.md`, `docs/llm/CONTEXT.md` (folder map), `docs/template/PAGES.md` (route map)  
**Do not touch:** product docs 00–10 except ADR already amended  

**Steps:**

1. Replace PawPair route lists with Playmates routes.
2. Point agents at `packages/mocks` and `ROADMAP/11-handoff-to-real-data.md`.
3. Do not claim Prisma has Playmates models.

**Acceptance:** `docs/template/PAGES.md` lists the 8 public routes and the admin session workspace paths.

**Validate:** none.

---

## Phase 7 exit = roadmap complete

The human can demo both apps. Wiring real data is **not** started.
