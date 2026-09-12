# Prompt — Recording Import & Organization Workspace

Implement the recording import/organization phase.

Read:
- `02-domain/recording-model.md`
- `04-workflows/import-and-pairing.md`
- `06-ui/admin-session-workspace.md`
- `07-engineering/upload-architecture.md`

Build a desktop-friendly session workspace where the admin can:

- drag/drop many video files
- see local filename, size, duration when available, and timestamp metadata
- persist recording metadata to Supabase
- leave files unassigned
- create games
- drag recordings into a game
- assign camera side A/B
- support one or multiple recordings per side
- auto-number parts
- reorder recordings
- move recordings between games
- remove/reselect a local file before upload

Critical:
- do not upload media to Supabase Storage
- do not assume every game has two videos
- do not infer team from camera side
- browser File objects are ephemeral
- clearly distinguish saved metadata from local bytes that exist only in the current browser session

Reuse Jabkit for generic UI. Create custom domain UI only where necessary.

Do not implement Google upload in this task unless explicitly included.
