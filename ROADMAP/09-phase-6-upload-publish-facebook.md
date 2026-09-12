# Phase 6 — Mock upload, publish, Facebook drafts

Goal: the workspace Upload and Review steps **do** things. Public site updates when José publishes. No real provider APIs.

Read first: [`docs/04-workflows/retry-and-recovery.md`](../docs/04-workflows/retry-and-recovery.md), [`docs/07-engineering/state-machines.md`](../docs/07-engineering/state-machines.md), [`docs/05-integrations/facebook.md`](../docs/05-integrations/facebook.md), OpenSpec `provider-upload`, `publishing`, `facebook-post-drafting`.

---

### PNJ-072 — Wire mock upload jobs to the Upload step

**Phase** 6 · **Depends on** PNJ-017, PNJ-070 · **Size** L  
**Edit:** `sessions/[id]/upload/page.tsx`, `actions.ts`  
**Create:** `apps/admin/src/app/(dashboard)/sessions/[id]/upload/actions.ts`  
**Do not touch:** Google SDKs, fetch to Drive/YouTube  

**Steps:**

1. Actions: `queueRecording({ recordingId, provider })`, `queueSession({ sessionId, providers: Provider[] })`, `retryJob`, `cancelJob`.
2. Buttons on `UploadMatrix` rows and a bulk “Queue all missing”.
3. Polling: client `setInterval` 400ms calling a server action `getJobs(sessionId)` **or** `router.refresh()` until no job is in `queued|initiating|uploading|processing`. Stop interval on unmount.
4. Progress cells use `UploadProviderStatus`.
5. On complete, `ProviderAsset` rows appear (simulator). Display URL as a link.
6. Set session.status to `uploading` while any job active, `ready` when all queued work finished (even if some failed).
7. Never send `File` bytes. Comment in `actions.ts`: “Replace this action body with resumable upload later — see ROADMAP/11.”

**Acceptance:** On a **new** session, import one fake file, organize it, queue Drive+YouTube, watch progress reach completed, see two fake URLs. Sep 9 bulk queue is a no-op for already completed assets (or shows ASSET_EXISTS — then skip those).

**Validate:** admin typecheck + browser on a newly created session (not only the seed).

---

### PNJ-073 — Independent retry, cancel, replace

**Phase** 6 · **Depends on** PNJ-072 · **Size** M  

**Steps:**

1. Failed cell: Retry + Copy error (`lastErrorCode lastErrorMessage`).
2. In-flight: Cancel.
3. Completed: “Replace…” AlertDialog then `enqueue(..., { replace: true })` which archives the old asset (`isActive` or delete mock asset) and starts a new job.
4. Retry YouTube must not change Drive `completed` job or asset.
5. Add a debug button on the draft session or a filename containing `FAIL` to force YouTube failure (simulator hook from PNJ-017). Document in the upload page: “Name a file with FAIL to simulate YouTube failure.”

**Acceptance:** Force-fail YouTube, Drive stays complete, Retry YouTube succeeds on second try (simulator should succeed on retry unless you keep failing — **succeed on attemptCount > 1**).

**Validate:** admin typecheck + browser fail/retry.

---

### PNJ-074 — Publish and unpublish

**Phase** 6 · **Depends on** PNJ-071, PNJ-018 · **Size** M  
**Edit:** publish step actions  

**Steps:**

1. `publishGame` sets game.visibility public, publishedAt now, status published.
2. `publishSession` sets session public + publishedAt. **Does not** auto-publish games — offer a checkbox “also publish all games”. Default on.
3. Warn dialog if any selected game lacks a YouTube or Drive asset. Confirm proceeds anyway.
4. Unpublish buttons reverse visibility and clear publishedAt (or keep publishedAt for history — **clear visibility only**, keep publishedAt for audit).
5. `revalidatePath` for `/sessions`, `/sessions/[id]`, and document that the **web** app is a different process — mock singleton is **per Node process**.  

   **Critical:** `apps/web` and `apps/admin` do **not** share memory. Publishing in admin will **not** show on web if they are two `next dev` processes.

   **Prototype fix (required in this ticket):** persist mock state to `packages/mocks/.data/store.json` on every write and read it on `getState()` if present. Gitignore that file. This is the one disk exception allowed so the prototype is demoable with both apps running. Do not put video bytes in the file.

6. Add `packages/mocks/.data/` to `.gitignore`.

**Acceptance:** Publish Sep 9 is already public. Unpublish game 10 → web `/games/2026-09-09-game-10` 404s after refresh (same store.json). Re-publish restores it.

**Validate:** admin + web typecheck. Browser both apps.

---

### PNJ-075 — Facebook drafts: generate, edit, copy, mark posted

**Phase** 6 · **Depends on** PNJ-016, PNJ-034, PNJ-071 · **Size** M  

**Steps:**

1. Action `generateDraft(gameId)` calls `posts.generate` using `formatFacebookBody` + current matchup + asset URLs + settings hashtags.
2. `updateDraft` increments `version`.
3. Copy button already on preview — ensure it copies the **current textarea** not a stale prop.
4. Checkbox “Marked as posted to Facebook Group” + optional URL field.
5. Dashboard “awaiting Facebook” uses `!postedAt` (add field on PostDraft if missing: `postedAt?: string; postedUrl?: string`).
6. Settings Facebook Group URL → “Open group” link on the publish step.

**Acceptance:** Generate on a game, see YouTube and Drive URLs in the body, edit a word, save, copy produces the edited text, mark posted removes it from dashboard widget.

**Validate:** admin typecheck + browser.

---

### PNJ-076 — Public visibility is the only public filter

**Phase** 6 · **Depends on** PNJ-074, PNJ-052 · **Size** S  
**Edit:** web `lib/playmates.ts` and mock `list` methods if gaps remain  

**Steps:**

1. Audit every public fetch: session, game, player, venue.
2. A public session with a private game: session page **omits** that game. Direct game URL 404s.
3. Player/venue pages only list public sessions/games.
4. Sitemap regeneration uses the same helpers.

**Acceptance:** Unpublish game 3 → `/sessions/2026-09-09` shows 9 games; old game 3 URL 404s; home recent games drops it.

**Validate:** web typecheck + browser.

---

## Phase 6 exit checklist

- [ ] Progress animation on mock jobs
- [ ] Independent retry
- [ ] store.json shared between web and admin
- [ ] Publish/unpublish reflected on port 9000
- [ ] Facebook copy + mark posted
