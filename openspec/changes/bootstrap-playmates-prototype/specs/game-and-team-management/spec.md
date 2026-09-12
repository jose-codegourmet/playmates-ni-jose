## Purpose

Games belong to one session and hold two teams of players independently from camera sides. Trace: `docs/02-domain/game-and-team-model.md`.

## ADDED Requirements

### Requirement: Game belongs to one session
The system SHALL attach each game to exactly one session. `game_number` SHALL be unique per session. `sort_order` SHALL be explicit and games SHALL be reorderable.

#### Scenario: Create 10 games
- **WHEN** the admin creates 10 games on a session
- **THEN** each game has a unique `game_number` in that session and an explicit `sort_order`

#### Scenario: Reorder game 10 to position 3
- **WHEN** the admin moves game 10 to position 3
- **THEN** display order updates
- **AND** visible game numbers are renumbered to match the new order

### Requirement: Incomplete games are valid
The system SHALL allow a game with zero recordings and unset players.

#### Scenario: Game shell
- **WHEN** the admin creates a game without players or recordings
- **THEN** the game persists and remains editable

### Requirement: Teams via join tables
The system SHALL store two `game_teams` per normal game (`team_no` 1 and 2). Players SHALL hang off `game_team_players` and MUST NOT use fixed `player_1` columns.

#### Scenario: Singles one player per team
- **WHEN** the admin assigns one player to team 1 and one player to team 2
- **THEN** each assignment is a `game_team_players` row

### Requirement: Matchup display label
The system SHALL format matchup display as `José & Carlo vs Mika & Marco` when names exist. If teams are empty, the label SHALL be `Team 1 vs Team 2`.

#### Scenario: Empty matchup label
- **WHEN** a game has no players on either team
- **THEN** the matchup label is `Team 1 vs Team 2`

#### Scenario: Named doubles matchup
- **WHEN** team 1 is José and Carlo and team 2 is Mika and Marco
- **THEN** the matchup label is `José & Carlo vs Mika & Marco`

### Requirement: Camera side must not infer team
The system MUST NOT infer Team 1 or Team 2 from camera Side A or Side B.

#### Scenario: Side does not pick team
- **WHEN** a recording is Side A
- **THEN** the system does not assign or suggest a team from that side

### Requirement: Optional winner
The system SHALL allow `winner_team_no` to be unset.

#### Scenario: Game without winner
- **WHEN** the admin saves a game without a winner
- **THEN** `winner_team_no` remains unset

### Requirement: Game visibility is independent
The system SHALL store game visibility independently of the session. Public game pages SHALL require the game (and typically the session) to be public; see publishing.

#### Scenario: Private game on public session
- **WHEN** a session is public and a game on it is private
- **THEN** the public game page for that game is not shown
