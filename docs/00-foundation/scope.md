# Scope

## MVP scope

### Authentication
- Private admin login.
- José can create his admin account.
- Public viewers do not need accounts.

### Player management
- Create, edit, archive players.
- Store display name.
- Optional Facebook profile URL/name.
- Optional nickname.
- Optional notes.
- Optional avatar later.

### Venue/court management
- Create and edit venues.
- Store venue name, optional address, notes, and individual court labels if useful.

### Session management
A session represents one badminton outing/date.

Store:
- session date
- venue
- title
- notes
- participating players
- status

### Game management
A session contains multiple games.

Store:
- game number/order
- players/teams
- winner/result if desired
- notes
- publication status

### Recording management
A game contains one or many recordings.

Each recording can store:
- original local filename
- side/camera label
- part number
- local size/type metadata
- duration if browser can read it
- Google Drive information
- YouTube information
- upload statuses

### Google Drive publishing
- Create/use a session folder.
- Upload video recordings using resumable uploads.
- Store Drive IDs and URLs.

### YouTube publishing
- Upload each recording.
- Set title/description/privacy.
- Store YouTube video ID and URL.
- Allow retry after failure.

### Facebook preparation
- Generate one copy-ready Facebook post per game.
- Include player matchup and provider links.
- Manual Facebook posting remains outside the automated publish operation.

### Public site
- Session archive
- session detail
- game detail
- player pages
- venue pages
- YouTube links/embeds where allowed
- Drive links

## Explicitly out of scope for the first version

- Raw video storage in Supabase
- Automatic Facebook Group posting through unofficial/browser automation
- Video editing or transcoding
- AI highlight generation
- Computer vision player detection
- Automated score detection
- Tournament brackets
- Payments
- Native mobile application
- Multi-organization SaaS billing
- Full social network features

## Possible later features

- player profiles with game history
- win/loss tracking
- skill level
- tags
- favorites
- search/filter by player, venue, date
- automatic file pairing based on timestamps
- thumbnails
- clips/highlights
- scoring metadata
- analytics
- shareable playlists
