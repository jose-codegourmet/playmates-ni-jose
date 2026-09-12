# Prompt — Google OAuth + Drive + YouTube

Implement the Google provider foundation.

Read all files in `05-integrations/` and `07-engineering/upload-architecture.md`.

Requirements:

- secure Google OAuth
- minimal required scopes
- refresh tokens never exposed to browser/public DB reads
- admin settings page showing connected account
- Drive resumable upload
- YouTube upload
- direct browser-to-provider transfer where feasible
- provider-level upload jobs
- independent Drive/YouTube retry
- progress UI
- completion metadata saved to `provider_assets`
- no raw video storage in Supabase
- no proxying multi-GB files through standard Vercel request bodies
- protect against duplicate upload on retry

YouTube:
- implement configurable privacy
- surface platform/account/audit restrictions clearly
- do not claim a video is public until provider state confirms it

Drive:
- create/reuse session folder
- store folder/file IDs
- configurable sharing policy

Before coding, inspect the repository's existing OAuth/security helpers and make a plan.
