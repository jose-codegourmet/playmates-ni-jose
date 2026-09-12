# Product Vision

## Vision

Create a lightweight badminton media archive for **Playmates ni José** that turns José's repetitive post-game workflow into a structured, mostly automated publishing process.

The app should eliminate the need to repeatedly:

- rename and sort recordings manually
- remember which clips belong to which game
- manually prepare Drive folders
- separately upload every file to YouTube
- repeatedly type player names and links
- reconstruct old game information later

## Desired experience

After badminton:

1. José opens the admin dashboard.
2. Creates a session for the date and venue.
3. Selects or creates the players who participated.
4. Drags all video files into the browser.
5. The UI helps organize clips into games and camera sides.
6. José reviews the grouping.
7. He clicks publish/upload.
8. Files are uploaded to Google Drive and YouTube.
9. URLs and provider IDs are stored in Supabase.
10. Each game receives generated Facebook-ready post copy.
11. Public pages become available once games are marked published.

## Product principles

### Metadata-first
Supabase is the system of record for structured metadata, not raw media.

### One upload workspace
José should not have to separately open Drive, YouTube, and his database to prepare a session.

### Flexible recording model
A game can have one or many clips. Camera interruptions are normal.

### Human-review before publish
Automatic pairing/grouping should be helpful, but José remains able to correct game number, side, order, players, title, and notes before publication.

### Public archive
Published games should form a useful searchable archive rather than being merely an admin upload tool.

### Low recurring cost
Use provider storage and video hosting already suited to large media files rather than duplicating storage inside the app.

### Agent-friendly repository
Business rules should live in docs and code should follow the repository's AGENTS/documentation conventions.
