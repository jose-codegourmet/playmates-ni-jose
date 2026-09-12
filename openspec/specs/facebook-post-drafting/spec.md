# Facebook Post Drafting

## Purpose

The admin generates and copies Facebook Group post text per game. The app never posts to Facebook. Trace: ADR-003, naming conventions.

## Requirements

### Requirement: One versioned draft per game
The system SHALL store one `post_draft` per game for platform `facebook_group`. Edits SHALL increment a version.

#### Scenario: Generate draft after matchup and links exist
- **WHEN** a game has a matchup and provider links and the admin generates a draft
- **THEN** a `facebook_group` post_draft exists for that game

#### Scenario: Edit persists version increment
- **WHEN** the admin edits and saves the draft body
- **THEN** the saved body persists
- **AND** the draft version increments

### Requirement: Draft body contents
The draft body SHALL include game label, player names, YouTube URLs, Drive URLs, optional notes, and optional hashtags.

#### Scenario: Body includes links and names
- **WHEN** a draft is generated for a game with players and provider URLs
- **THEN** the body contains the game label, player names, and those URLs

### Requirement: Edit and copy
The admin SHALL be able to edit and save the draft. A copy button SHALL copy the current body.

#### Scenario: Copy to clipboard
- **WHEN** the admin clicks copy
- **THEN** the current draft body is copied to the clipboard

### Requirement: Mark posted without posting
The admin MAY mark a draft as posted and MAY store a post URL. The app MUST NEVER post to Facebook.

#### Scenario: Mark posted is local only
- **WHEN** the admin marks a draft posted and optionally saves a post URL
- **THEN** those fields persist
- **AND** the system does not call Facebook
