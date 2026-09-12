# Ticket index (for the splitting subagent)

This is the **complete** list. Do not invent `PNJ-###` numbers. Do not drop tickets.

Full ticket bodies live in the phase files. This table is the dependency graph and routing index.

**How to split:** one work item per row. Title = ticket title. Description = copy the entire `### PNJ-###` section from the phase file. Keep Depends on, Do not touch, Validate.

| ID | Title | Phase | Depends on | Size | Body lives in | Primary paths |
|---|---|---|---|---|---|---|
| PNJ-001 | Revise ADR-006 and root AGENTS.md for hybrid UI | 0 | — | S | [03](03-phase-0-purge-and-rebrand.md) | `docs/10-decisions/ADR-006-jabkit-first.md`, `AGENTS.md`, `docs/README.md` |
| PNJ-002 | Initialize OpenSpec | 0 | — | S | [01](01-openspec.md) | `openspec/`, `AGENTS.md` |
| PNJ-003 | Author 10 capability specs + bootstrap change | 0 | PNJ-002 | L | [01](01-openspec.md) | `openspec/specs/*`, `openspec/changes/bootstrap-playmates-prototype/` |
| PNJ-004 | Delete PawPair public pages/sections/hooks | 0 | PNJ-001 | L | [03](03-phase-0-purge-and-rebrand.md) | `apps/web/src/app/**`, `apps/web/src/sections/**` |
| PNJ-005 | Delete PawPair admin CRUD pages | 0 | PNJ-001 | L | [03](03-phase-0-purge-and-rebrand.md) | `apps/admin/src/app/(dashboard)/**`, hooks |
| PNJ-006 | Rebrand layout, fonts, routes, seo, navigation | 0 | PNJ-004, PNJ-005 | M | [03](03-phase-0-purge-and-rebrand.md) | `constants/*`, Header, Footer, AdminSidebar |
| PNJ-007 | MOCK_AUTH bypass | 0 | PNJ-005 | M | [03](03-phase-0-purge-and-rebrand.md) | `apps/admin/middleware.ts`, `use-current-user`, `.env.example` |
| PNJ-008 | Document JabKit src/components exception | 0 | PNJ-001 | XS | [03](03-phase-0-purge-and-rebrand.md) | `docs/frontend-conventions.md`, `docs/llm/PATTERNS.md` |
| PNJ-009 | jabkit init inside apps/web | 0 | PNJ-008 | S | [03](03-phase-0-purge-and-rebrand.md) | `apps/web/jabkit.config.json` |
| PNJ-010 | Reconcile --jk-* tokens | 0 | PNJ-009 | M | [03](03-phase-0-purge-and-rebrand.md) | `apps/web/src/app/globals.css` |
| PNJ-011 | Create @fe-template/mocks workspace | 1 | PNJ-001 | S | [04](04-phase-1-mock-data-layer.md) | `packages/mocks/**` |
| PNJ-012 | Domain types matching schema | 1 | PNJ-011 | M | [04](04-phase-1-mock-data-layer.md) | `packages/mocks/src/types.ts` |
| PNJ-013 | Seed Sep 9 2026 MVP scenario | 1 | PNJ-012 | L | [04](04-phase-1-mock-data-layer.md) | `packages/mocks/src/seed.ts` |
| PNJ-014 | Repository interfaces | 1 | PNJ-012 | M | [04](04-phase-1-mock-data-layer.md) | `packages/mocks/src/repositories/types.ts` |
| PNJ-015 | In-memory store + implementations | 1 | PNJ-013, PNJ-014 | XL | [04](04-phase-1-mock-data-layer.md) | `packages/mocks/src/store.ts`, `memory/*` |
| PNJ-016 | Naming/slug/title/Facebook generators | 1 | PNJ-012 | M | [04](04-phase-1-mock-data-layer.md) | `packages/mocks/src/naming.ts` |
| PNJ-017 | Fake upload simulator | 1 | PNJ-015 | L | [04](04-phase-1-mock-data-layer.md) | `packages/mocks/src/upload-simulator.ts` |
| PNJ-018 | App-facing accessors | 1 | PNJ-015, PNJ-016, PNJ-017 | S | [04](04-phase-1-mock-data-layer.md) | `apps/*/src/lib/playmates.ts` |
| PNJ-019 | Install JabKit atoms via CLI | 2 | PNJ-010 | S | [05](05-phase-2-component-library.md) | `apps/web/src/components/jabkit/**` |
| PNJ-020 | Install JabKit marketing blocks via CLI | 2 | PNJ-019 | M | [05](05-phase-2-component-library.md) | `apps/web/src/components/jabkit/**` |
| PNJ-021 | SessionCard | 2 | PNJ-019 | S | [05](05-phase-2-component-library.md) | `apps/web/src/sections/_shared/session-card/` |
| PNJ-022 | GameCard | 2 | PNJ-016, PNJ-019 | S | [05](05-phase-2-component-library.md) | `apps/web/src/sections/_shared/game-card/` |
| PNJ-023 | PlayerCard | 2 | PNJ-019 | S | [05](05-phase-2-component-library.md) | `apps/web/src/sections/_shared/player-card/` |
| PNJ-024 | VenueCard | 2 | PNJ-019 | XS | [05](05-phase-2-component-library.md) | `apps/web/src/sections/_shared/venue-card/` |
| PNJ-025 | MatchupLabel | 2 | PNJ-016 | XS | [05](05-phase-2-component-library.md) | `apps/web/src/sections/_shared/matchup-label/` |
| PNJ-026 | RecordingCard | 2 | PNJ-038 | S | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/recording-card/` |
| PNJ-027 | RecordingDropzone | 2 | — | M | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/recording-dropzone/` |
| PNJ-028 | CameraSideLane | 2 | PNJ-026 | S | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/camera-side-lane/` |
| PNJ-029 | GameRecordingBoard presentational | 2 | PNJ-026, PNJ-028 | M | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/game-recording-board/` |
| PNJ-030 | GameTeamEditor | 2 | PNJ-025 | M | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/game-team-editor/` |
| PNJ-031 | UploadProviderStatus | 2 | PNJ-038 | S | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/upload-provider-status/` |
| PNJ-032 | UploadQueue | 2 | PNJ-031 | S | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/upload-queue/` |
| PNJ-033 | UploadMatrix | 2 | PNJ-031 | S | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/upload-matrix/` |
| PNJ-034 | FacebookPostPreview | 2 | — | S | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/facebook-post-preview/` |
| PNJ-035 | SessionPublishChecklist | 2 | PNJ-038 | S | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/session-publish-checklist/` |
| PNJ-036 | SessionWorkspaceHeader | 2 | PNJ-038 | S | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/session-workspace-header/` |
| PNJ-037 | SessionWorkspaceStepper | 2 | — | S | [05](05-phase-2-component-library.md) | `apps/admin/src/modules/playmates/session-workspace-stepper/` |
| PNJ-038 | StatusBadge + VisibilityBadge | 2 | PNJ-012 | XS | [05](05-phase-2-component-library.md) | web `_shared/status-badge` + admin copy |
| PNJ-039 | ProviderLinkList | 2 | PNJ-012 | XS | [05](05-phase-2-component-library.md) | `apps/web/src/sections/_shared/provider-link-list/` |
| PNJ-040 | YoutubeEmbed | 2 | — | S | [05](05-phase-2-component-library.md) | `apps/web/src/sections/_shared/youtube-embed/` |
| PNJ-041 | Finish routes/seo/navigation | 3 | PNJ-006, PNJ-018 | S | [06](06-phase-3-public-site.md) | `apps/web/src/constants/*` |
| PNJ-042 | Header/Footer compose | 3 | PNJ-020, PNJ-041 | M | [06](06-phase-3-public-site.md) | `apps/web/src/modules/layout/**` |
| PNJ-043 | Home page | 3 | PNJ-020, PNJ-021, PNJ-022, PNJ-052 | M | [06](06-phase-3-public-site.md) | `apps/web/src/app/page.tsx`, `sections/home/**` |
| PNJ-044 | Sessions index | 3 | PNJ-021, PNJ-052 | M | [06](06-phase-3-public-site.md) | `apps/web/src/app/sessions/` |
| PNJ-045 | Session detail | 3 | PNJ-022, PNJ-023, PNJ-052 | M | [06](06-phase-3-public-site.md) | `apps/web/src/app/sessions/[sessionSlug]/` |
| PNJ-046 | Game page | 3 | PNJ-025, PNJ-039, PNJ-040, PNJ-052 | L | [06](06-phase-3-public-site.md) | `apps/web/src/app/games/[gameSlug]/` |
| PNJ-047 | Players index | 3 | PNJ-023, PNJ-052 | S | [06](06-phase-3-public-site.md) | `apps/web/src/app/players/` |
| PNJ-048 | Player detail | 3 | PNJ-021, PNJ-022, PNJ-052 | M | [06](06-phase-3-public-site.md) | `apps/web/src/app/players/[playerSlug]/` |
| PNJ-049 | Venues index | 3 | PNJ-024, PNJ-052 | S | [06](06-phase-3-public-site.md) | `apps/web/src/app/venues/` |
| PNJ-050 | Venue detail | 3 | PNJ-021, PNJ-052 | S | [06](06-phase-3-public-site.md) | `apps/web/src/app/venues/[venueSlug]/` |
| PNJ-051 | sitemap, robots, metadata audit | 3 | PNJ-043–PNJ-050 | S | [06](06-phase-3-public-site.md) | `apps/web/src/app/sitemap.ts`, `robots.ts` |
| PNJ-052 | Public data hooks | 3 | PNJ-018 | S | [06](06-phase-3-public-site.md) | `apps/web/src/hooks/use-public-*` |
| PNJ-053 | Admin sidebar chrome | 4 | PNJ-006, PNJ-007 | S | [07](07-phase-4-admin-foundation.md) | `AdminSidebar.tsx`, dashboard layout |
| PNJ-054 | Dashboard widgets | 4 | PNJ-018, PNJ-038, PNJ-053 | M | [07](07-phase-4-admin-foundation.md) | `apps/admin/.../dashboard/` |
| PNJ-055 | Players CRUD | 4 | PNJ-018, PNJ-053 | L | [07](07-phase-4-admin-foundation.md) | `apps/admin/.../players/` |
| PNJ-056 | Venues and courts CRUD | 4 | PNJ-018, PNJ-053 | L | [07](07-phase-4-admin-foundation.md) | `apps/admin/.../venues/` |
| PNJ-057 | Sessions list | 4 | PNJ-018, PNJ-038, PNJ-053 | M | [07](07-phase-4-admin-foundation.md) | `apps/admin/.../sessions/page.tsx` |
| PNJ-058 | Create session | 4 | PNJ-055, PNJ-056, PNJ-057 | M | [07](07-phase-4-admin-foundation.md) | `apps/admin/.../sessions/new/` |
| PNJ-059 | Settings placeholders | 4 | PNJ-053 | S | [07](07-phase-4-admin-foundation.md) | `apps/admin/.../settings/**` |
| PNJ-060 | Workspace shell + stepper | 5 | PNJ-036, PNJ-037, PNJ-057 | M | [08](08-phase-5-session-workspace.md) | `sessions/[id]/layout.tsx` |
| PNJ-061 | Step Details | 5 | PNJ-060 | M | [08](08-phase-5-session-workspace.md) | `sessions/[id]/details/` |
| PNJ-062 | Step Players roster | 5 | PNJ-055, PNJ-060 | M | [08](08-phase-5-session-workspace.md) | `sessions/[id]/players/` |
| PNJ-063 | Step Import | 5 | PNJ-027, PNJ-060 | L | [08](08-phase-5-session-workspace.md) | `sessions/[id]/import/` |
| PNJ-064 | Organize layout from store | 5 | PNJ-029, PNJ-060 | M | [08](08-phase-5-session-workspace.md) | `sessions/[id]/organize/` |
| PNJ-065 | Organize drag assign | 5 | PNJ-064 | L | [08](08-phase-5-session-workspace.md) | game-recording-board DnD |
| PNJ-066 | Organize parts + reorder | 5 | PNJ-065 | M | [08](08-phase-5-session-workspace.md) | organize + normalizeParts |
| PNJ-067 | Organize add/remove games | 5 | PNJ-064 | S | [08](08-phase-5-session-workspace.md) | organize actions |
| PNJ-068 | Organize persist + status | 5 | PNJ-065, PNJ-066, PNJ-067 | S | [08](08-phase-5-session-workspace.md) | session/recording status |
| PNJ-069 | Step Matchups | 5 | PNJ-030, PNJ-062 | L | [08](08-phase-5-session-workspace.md) | `sessions/[id]/matchups/` |
| PNJ-070 | Step Upload UI | 5 | PNJ-032, PNJ-033, PNJ-060 | M | [08](08-phase-5-session-workspace.md) | `sessions/[id]/upload/` |
| PNJ-071 | Step Review & Publish UI | 5 | PNJ-034, PNJ-035, PNJ-060 | M | [08](08-phase-5-session-workspace.md) | `sessions/[id]/publish/` |
| PNJ-072 | Wire mock upload jobs | 6 | PNJ-017, PNJ-070 | L | [09](09-phase-6-upload-publish-facebook.md) | upload actions + simulator |
| PNJ-073 | Retry / cancel / replace | 6 | PNJ-072 | M | [09](09-phase-6-upload-publish-facebook.md) | upload actions |
| PNJ-074 | Publish/unpublish + store.json | 6 | PNJ-071, PNJ-018 | M | [09](09-phase-6-upload-publish-facebook.md) | mocks persist, publish actions |
| PNJ-075 | Facebook drafts generate/edit/copy | 6 | PNJ-016, PNJ-034, PNJ-071 | M | [09](09-phase-6-upload-publish-facebook.md) | post_drafts |
| PNJ-076 | Public visibility filter audit | 6 | PNJ-074, PNJ-052 | S | [09](09-phase-6-upload-publish-facebook.md) | `apps/web/src/lib/playmates.ts` |
| PNJ-077 | Empty/loading/error states | 7 | PNJ-043–050, PNJ-054–071 | M | [10](10-phase-7-polish-and-acceptance.md) | lists + loading.tsx |
| PNJ-078 | Storybook coverage | 7 | Phase 2 components | M | [10](10-phase-7-polish-and-acceptance.md) | `*.stories.tsx` |
| PNJ-079 | Responsive + a11y pass | 7 | UI tickets | M | [10](10-phase-7-polish-and-acceptance.md) | public + admin |
| PNJ-080 | MVP acceptance walkthrough | 7 | PNJ-076, PNJ-077 | L | [10](10-phase-7-polish-and-acceptance.md) | `ROADMAP/ACCEPTANCE-LOG.md` |
| PNJ-081 | Docs sweep | 7 | PNJ-080 | S | [10](10-phase-7-polish-and-acceptance.md) | AGENTS.md, template PAGES.md |

**Count:** 81 tickets (PNJ-001–PNJ-081).

## Parallelism the splitter may use

Safe parallel groups (no shared files if agents are careful):

- After PNJ-001: PNJ-002 and PNJ-008 in parallel.
- After PNJ-004+005: PNJ-006, PNJ-007.
- After PNJ-011+012: PNJ-013 and PNJ-014 and PNJ-016 in parallel.
- After PNJ-019: PNJ-021–025, PNJ-038–040 in parallel.
- After PNJ-038: PNJ-026–037 admin widgets in parallel (except 028 needs 026, 029 needs 028, 032/033 need 031).
- After PNJ-052: PNJ-044–050 can parallelize once cards exist (watch `sections/` collisions).
- After PNJ-053: PNJ-055 and PNJ-056 in parallel; PNJ-059 anytime after 053.
- After PNJ-064: PNJ-067 can run beside PNJ-065.

Do **not** parallelize two tickets that edit `packages/mocks/src/index.ts` or `AdminSidebar.tsx` or `globals.css`.

## Out of scope (never ticket these in this pass)

- Prisma Playmates schema / migrate
- Real Google OAuth, Drive, YouTube
- Facebook Graph API
- Renaming `@fe-template/*`
- `jabkit add --all`
- Scores, AI pairing, highlights, playlists

See [11-handoff-to-real-data.md](11-handoff-to-real-data.md).

## Suggested first five tickets for a single agent

1. PNJ-001  
2. PNJ-002  
3. PNJ-003  
4. PNJ-008  
5. PNJ-004  

Then PNJ-005 → PNJ-006 → PNJ-007 → PNJ-009 → PNJ-010 → Phase 1 mocks.
