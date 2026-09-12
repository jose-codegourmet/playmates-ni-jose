# Public Archive Browsing

## Purpose

Visitors browse published sessions, games, players, and venues. Private or unknown slugs return 404. Trace: `docs/06-ui/public-site.md`.

## Requirements

### Requirement: Public archive routes
The public site SHALL provide routes `/`, `/sessions`, `/sessions/[sessionSlug]`, `/games/[gameSlug]`, `/players`, `/players/[playerSlug]`, `/venues`, and `/venues/[venueSlug]`.

#### Scenario: Session detail route
- **WHEN** a visitor opens `/sessions/2026-09-09` for a public session
- **THEN** the session page renders

### Requirement: Home is an archive landing
Home SHALL show latest public sessions and recent public games and MUST NOT be a dating-app landing page.

#### Scenario: Visitor sees Sep 9 published session
- **WHEN** the Sep 9 session is published and public
- **THEN** a visitor sees it among latest public sessions on home or `/sessions`

### Requirement: Session filters
The sessions index SHALL filter by date, player, and venue. Client-side filters on mocks are acceptable.

#### Scenario: Filter by venue
- **WHEN** a visitor filters `/sessions` by venue
- **THEN** only matching public sessions are shown

### Requirement: Game page contents
A public game page SHALL show matchup, date/venue, ordered recordings, a YouTube embed when `embed_url` exists, Drive links, and prev/next game in the same session.

#### Scenario: Two Side B parts ordered
- **WHEN** a visitor opens a public game that has two Side B parts
- **THEN** recordings show Part 1 then Part 2

### Requirement: Player page contents
A public player page SHALL show the player name and recent public sessions and games. Stats are NOT required.

#### Scenario: Player recent public games
- **WHEN** a visitor opens a public player page
- **THEN** the page shows the name and recent public sessions or games

### Requirement: Venue page contents
A public venue page SHALL show the venue name and public session history.

#### Scenario: Venue session history
- **WHEN** a visitor opens a public venue page
- **THEN** the page shows the name and that venue's public sessions

### Requirement: Private and unknown slugs 404
The system SHALL return 404 for an unknown slug or a private slug. Returning 404 is preferred so a private session's existence is not leaked.

#### Scenario: Visitor cannot open a draft session slug
- **WHEN** a visitor requests the slug of a draft or private session
- **THEN** the response is 404
