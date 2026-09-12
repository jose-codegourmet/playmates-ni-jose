# Recording Organization

## Purpose

Admins organize imported recordings onto games and camera sides without hard pairing rules. Trace: admin organize screen, ADR-002.

## Requirements

### Requirement: Admin can assign and reorder
The system SHALL let the admin create games, assign a recording to a game, set side `A` or `B` or `UNASSIGNED`, and reorder parts.

#### Scenario: Game 4 Side B two parts
- **WHEN** the admin assigns two recordings to Game 4 Side B and orders them
- **THEN** those recordings store Game 4, side `B`, and consecutive part numbers

#### Scenario: Move clip between games
- **WHEN** the admin moves a recording from one game to another
- **THEN** the recording's `game_id` updates
- **AND** part numbers on both affected side groups re-normalize

### Requirement: Part numbers scoped and normalized
Part numbers SHALL be scoped to `(game_id, camera_side)` and MUST auto-normalize to `1..n` after a move.

#### Scenario: Normalize after reorder
- **WHEN** the admin reorders parts on a side
- **THEN** part numbers become 1 through n with no gaps

### Requirement: Incomplete pairing is valid
The system MUST NOT reject: one side missing; three parts on one side; zero recordings on a game.

#### Scenario: Game 8 one recording
- **WHEN** the admin assigns a single recording to Game 8
- **THEN** the system accepts the game without requiring the other side

#### Scenario: Three parts on one side
- **WHEN** the admin assigns three parts to Side A and none to Side B
- **THEN** the system accepts the organization

#### Scenario: Game with zero recordings
- **WHEN** a game has no recordings
- **THEN** the system does not reject the game

### Requirement: Unassigned area is valid
The system SHALL treat the unassigned area as a valid place for recordings.

#### Scenario: Leave clip unassigned
- **WHEN** the admin leaves a recording unassigned
- **THEN** the recording remains with null `game_id` and is not treated as an error

### Requirement: Pairing suggestions are optional
If timestamp pairing suggestions are implemented later, they MUST be visibly optional. Suggestions are NOT required for the prototype.

#### Scenario: Prototype without suggestions
- **WHEN** the admin organizes recordings in the prototype
- **THEN** organization works without timestamp pairing suggestions
