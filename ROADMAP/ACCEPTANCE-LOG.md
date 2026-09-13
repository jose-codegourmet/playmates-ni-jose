# PNJ-080 — MVP acceptance log

**Issue:** [#80](https://github.com/jose-codegourmet/playmates-ni-jose/issues/80)  
**Date:** 2026-09-13  
**Agent environment:** Cloud VM (no interactive browser click-through, no Playwright).  
**Method:** wiped `packages/mocks/.data/store.json`, `resetState()` to seed Sep 9, then ran the full create→publish path on a **new** `2026-09-16` session through `@fe-template/mocks` repositories + upload simulator. HTTP-checked live `MOCK_AUTH=true` admin and public Next servers. Did **not** click the admin stepper in a browser.

**Seed / create split (roadmap preference):**

| Session | Role |
|---|---|
| `2026-09-09` (seed, Smash Court QC, 10 games / 21 recordings, already public) | Public browse + organize/publish *shape* already in seed |
| `2026-09-16` (created this walkthrough) | Full create → venue → roster → 21 imports → 10 games → matchups → Drive/YouTube queue → fail/retry → publish → Facebook drafts |

`store.json` is gitignored. Do not commit it. Delete the file (or call `resetState()`) to return both apps to seed.

---

## Script (20 steps)

| # | Result | Evidence |
|---|---|---|
| 1 | **PASS** | `MOCK_AUTH=true pnpm --filter admin dev` → `GET http://127.0.0.1:9001/dashboard` **200**, no redirect to `/login`. HTML includes `data-slot="dashboard-widgets"`, title **Dashboard**, Unfinished uploads / Failed jobs / Quick create / Latest sessions. No “Sign in” / login form on the dashboard document. |
| 2 | **PASS** | After wipe + seed restore, `sessions.create({ sessionDate: "2026-09-09" })` was **not** used (slug already taken by seed). Created **`2026-09-16`** (`slug: "2026-09-16"`, title `PNJ-080 acceptance create path`). Seed `2026-09-09` still present. Admin UI `SessionForm` date field + `createSession` action exist; those clicks were not performed. |
| 3 | **PASS** | `2026-09-16` saved with `venueId` = Smash Court QC (`SEED_IDS.venues.smashCourtQc`). Public HTML and `getById` show venue name **Smash Court QC**. Seed venue label is “Smash Court QC”, not the shorter “Smash Court”. |
| 4 | **PASS** | `setRoster` with all 8 seed player ids. Persisted roster: José, Carlo, Mika, Marco, Ana, Luis, Bea, Nico. `SessionRosterEditor` + `setSessionRoster` exist in admin (not clicked). |
| 5 | **PASS** | `recordings.createMany` with 21 `.mp4` metadata rows (no `File` bytes). One filename contains `FAIL` (Game 4 Side B Part 2) for the YouTube force-fail hook. Import UI (`SessionImport`) accepts renamed `.mp4`; not clicked. |
| 6 | **PASS** | Created 10 games on `2026-09-16` and assigned all 21 recordings. Seed Sep 9 also has 10 games. Organize UI (`SessionOrganize` / `GameRecordingBoard`) has no “exactly two recordings” rule. |
| 7 | **PASS** | Game 4 Side B: two recordings; `normalizeParts` labels **`Game 4 - Side B - Part 1`** and **`Game 4 - Side B - Part 2`**. Matches `formatRecordingDisplayName` / naming doc. |
| 8 | **PASS** | Game 8: exactly one recording (`Side A`). Assign did not throw. No admin toast path fires on a single-file game (no “must have two files” check in organize/import). Live toast not observed. |
| 9 | **PASS** | `games.setTeams` on all 10 `2026-09-16` games (doubles rotation). `formatMatchup` / `formatGameTeamMatchup` produce names (`José & Carlo vs Mika & Marco`, etc.), not `Team 1 vs Team 2`. `GameTeamEditor` renders `matchupLabel` from those names. |
| 10 | **FAIL** | **Bug note:** `formatDriveFilename` and `formatYoutubeTitle` **match** [`docs/01-product/naming-conventions.md`](../docs/01-product/naming-conventions.md) (checked: `2026-09-16 - Game 04 - Side B - Part 02.mp4`; `Sep 16, 2026 \| Game 3 \| José & Carlo vs Mika & Marco \| Side A`). They are **not imported by admin upload/publish** (only exported from `@fe-template/mocks`). Simulator `ProviderAsset.title` is `displayName ?? originalFilename`. Facebook drafts use `formatFacebookBody` (correct). **Remainder:** human should still eyeball upload/publish cards. Follow-up: wire Drive/YouTube generators into enqueue / asset titles if the demo must show those exact strings. |
| 11 | **PASS** | Queued Drive for all 21 `2026-09-16` recordings. All 21 Drive jobs **`completed`**. Fake URLs like `https://example.com/drive/drv-mock-a30f1a25`. |
| 12 | **PASS** | Queued YouTube for all 21. 20 completed; the `FAIL` file’s first YouTube attempt **`failed`** (expected). |
| 13 | **PASS** | Simulator (not a painted Progress bar): `getJobView` at +800 ms → status `uploading`, **`progressPercent: 17`** (then 100 after the duration window). `UploadProviderStatus` renders `@fe-template/ui` `Progress` while `uploading` / `processing`. **Remainder:** live bar paint during admin poll was not screenshot. |
| 14 | **PASS** | After YouTube fail on the `FAIL` file, Drive job for that recording stayed **`completed`**. `uploads.retry` on the YouTube job succeeded (`attemptCount > 1` bypasses force-fail). Independent providers as specified. |
| 15 | **PASS** | After retry: 21 Drive + 21 YouTube `ProviderAsset` rows with URLs. `UploadProviderStatus` / publish cards render `assetUrl` when status is completed. |
| 16 | **PASS** | `packages/mocks/.data/store.json` (~119 KB). Recordings have `sizeBytes`, filenames, mime — **no** `bytes` / `file` / `buffer` / `videoBytes` / base64 payloads. |
| 17 | **PASS** | `publishSession` + `publishGame` × 10 on `2026-09-16`. Session `status: published`, `visibility: public`. All 10 games public. |
| 18 | **PASS** | `pnpm --filter web dev` → `GET /sessions/2026-09-09` **200**: Smash Court QC, Games 1–10, matchups, video counts. `GET /sessions/2026-09-16` **200**: title `PNJ-080 acceptance create path`, Smash Court QC, Games 1–10 (Game 8 = 1 video, Game 4 / 10 = 3 videos). `getPublicSession` agrees. |
| 19 | **PASS** | `posts.generate` for all 10 `2026-09-16` games. Bodies include matchup names, YouTube URLs, Drive URLs, `#PlaymatesNiJose #Badminton`. Seed Sep 9 already has 10 drafts (shorter seed bodies). |
| 20 | **FAIL** | **Bug note / remainder:** `FacebookPostPreview` has **Copy Facebook post** (`aria-label="Copy Facebook post"`) calling `navigator.clipboard.writeText(currentBody)`. This environment did not perform a browser clipboard write. **Human demo:** open publish, copy, paste. Not a product defect observed in code. |

**Counts:** **18 PASS** · **2 FAIL** (step 10 product gap; step 20 unverified clipboard).

---

## Non-functional

| Check | Result |
|---|---|
| Admin usable at 1280px | **Not verified here.** PNJ-079 just landed (`feat: responsive and a11y pass…`). **Remainder:** human desktop pass on organize / upload / publish. |
| Public usable at 375px | **Not verified here.** Public header uses `min-h-10` / `overflow-x-clip`. **Remainder:** human mobile pass on `/`, `/sessions/2026-09-09`, `/games/2026-09-09-game-4`. |
| No OAuth token in client payloads | **PASS (static).** Prototype has no Google OAuth; Settings copy is “OAuth will be wired later”. Walkthrough `oauthConnections: []`. No refresh/access tokens in `store.json`. |
| `pnpm lint` | **Skipped** (owner constraint for this ticket). |
| `pnpm typecheck` | **Skipped** (owner: validate with production builds instead). |
| `pnpm --filter web build` | Recorded in the PR after this log; required to pass. |
| `pnpm --filter admin build` | Recorded in the PR after this log; required to pass. |

---

## Human demo leftovers

1. Click Sessions → New in admin (date / Smash Court QC / 8-player roster) — server actions exist; this log used the same repos those actions call.
2. Drop 21 files in the import UI (reselect-file banner after refresh is expected; simulator does not store `File` bytes).
3. Drag organize + watch toasts.
4. Watch upload Progress bars while jobs run (~2.5–6 s).
5. Copy Facebook post and paste (step 20).
6. Viewport pass at 1280 (admin) and 375 (public).

---

## Small blockers

None fixed in this ticket. Step 10 is a **follow-up**, not a crash: naming helpers are correct but unused on Drive/YouTube asset titles.

Prototype is **demoable** from seed Sep 9 (public) plus a freshly published Sep 16 graph if `store.json` from this walkthrough is left on disk for a local two-app demo.
