# Player Management

## Purpose

Players are reusable people across sessions and games. Display name is the human identifier; Facebook identity is optional. Trace: `docs/01-product/business-rules.md` (Players).

## Requirements

### Requirement: Display name is required
The system SHALL require a display name to create a player. Facebook name and Facebook URL SHALL be optional.

#### Scenario: Add player with only a name
- **WHEN** the admin creates a player with display name `Carlo` and no Facebook fields
- **THEN** the system persists the player

### Requirement: Unique player slug
The system SHALL assign a unique slug derived from the display name. Colliding slugs SHALL receive a suffix.

#### Scenario: Slug from display name
- **WHEN** the admin creates a player named `José`
- **THEN** the slug is derived from that name and is unique

### Requirement: Archive instead of hard delete
The system SHALL set `is_archived` instead of hard-deleting a player when that player appears on any game or session roster.

#### Scenario: Archive player with history
- **WHEN** the admin archives a player who appears on a past game
- **THEN** the player record remains with `is_archived` true and is not hard-deleted

#### Scenario: Archived players hidden from default pickers
- **WHEN** the admin opens a default player picker
- **THEN** archived players are hidden
- **AND** archived players still render on historical games they already belong to

### Requirement: Session roster without every game
The system SHALL allow a player to be on a session roster without appearing in every game of that session.

#### Scenario: Roster-only player
- **WHEN** a player is added to the session roster and not assigned to a game team
- **THEN** the player remains on the session and is absent from unassigned games
