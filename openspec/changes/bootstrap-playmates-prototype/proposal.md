## Why

The repo still ships the PawPair dating-app template. Playmates ni José needs a mock-backed public archive and admin workspace so José can organize badminton sessions, recordings, uploads, and Facebook drafts without a real database or Google APIs. This change records the intended prototype behavior as ten new OpenSpec capabilities so later implementation tickets have a single source of truth.

## What Changes

- Introduce ten new capability specs under `openspec/specs/` describing intended current behavior of the prototype.
- Add matching **ADDED** requirement deltas under this change so the bootstrap can be validated and later archived.
- Do not implement app pages, Prisma models, or live provider integrations in this change.

## Capabilities

### New Capabilities

- `session-management`: play-date sessions as the admin workspace root and public archive folder
- `player-management`: player identity, slugs, archive instead of hard delete
- `venue-management`: venues, courts, and optional session assignment
- `game-and-team-management`: games, teams, matchup labels, and camera-side independence
- `recording-import`: local file import metadata, UUIDs, and lost File handles
- `recording-organization`: assign clips to games, sides, and parts without hard pairing rules
- `provider-upload`: independent simulated Drive and YouTube jobs
- `publishing`: explicit publish/unpublish and public visibility
- `facebook-post-drafting`: per-game Facebook Group drafts the app never posts
- `public-archive-browsing`: public routes, filters, and 404 for private slugs

### Modified Capabilities

None.

## Impact

- Documentation and OpenSpec only (`openspec/specs/*`, `openspec/changes/bootstrap-playmates-prototype/`).
- Implementation remains later tickets (pages, components, `packages/mocks`).
- No Prisma schema, no real Google Drive or YouTube APIs, no app source edits in this change.
