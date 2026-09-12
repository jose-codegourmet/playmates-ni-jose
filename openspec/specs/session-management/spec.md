# Session Management

## Purpose

A session is one play date. It is the admin workspace root and the public archive folder. Trace: `docs/02-domain/session-model.md`, `docs/01-product/business-rules.md` (Sessions).

## Requirements

### Requirement: Session date is required
The system SHALL require a `session_date` when creating a session. Title, venue, court, and notes SHALL be optional.

#### Scenario: Create Sep 9 2026 session
- **WHEN** the admin creates a session with `session_date` 2026-09-09
- **THEN** the system persists the session with that date

#### Scenario: Create session without venue
- **WHEN** the admin creates a session with a date and no venue
- **THEN** the system persists the session with venue and court unset

#### Scenario: Cannot create without date
- **WHEN** the admin submits a new session without `session_date`
- **THEN** the system rejects the create and does not persist a session

### Requirement: Session status is a convenience enum
The system SHALL store session status as one of `draft`, `organizing`, `uploading`, `ready`, `published`, `archived`. Status SHALL be convenience state and MUST NOT be the only source of truth for upload progress.

#### Scenario: Status does not replace upload jobs
- **WHEN** a session status is `uploading` while a provider job has failed
- **THEN** the job status remains authoritative for that provider

### Requirement: Session visibility defaults to private
The system SHALL store visibility as `private` or `public`. A newly created session SHALL default to `private`.

#### Scenario: New session is private
- **WHEN** the admin creates a session
- **THEN** visibility is `private`

### Requirement: Unique session slug
The system SHALL assign a unique slug. The default slug SHALL be the ISO date `YYYY-MM-DD`. Colliding slugs SHALL receive a suffix.

#### Scenario: Default slug from date
- **WHEN** the admin creates a session dated 2026-09-09 and no other session uses `2026-09-09`
- **THEN** the slug is `2026-09-09`

#### Scenario: Slug collision suffix
- **WHEN** the admin creates a second session dated 2026-09-09
- **THEN** the new slug is unique and uses a suffix

### Requirement: Empty session is valid
The system SHALL allow a session to exist with zero games and zero recordings.

#### Scenario: Session before recordings
- **WHEN** the admin creates a dated session and adds no games or recordings
- **THEN** the session remains valid and editable

### Requirement: Session players use a join table
The system SHALL store session players in a join table and MUST NOT store the roster as a JSON array on the session row.

#### Scenario: Roster is relational
- **WHEN** the admin adds players to a session
- **THEN** each membership is a join-table row, not a JSON array field

### Requirement: Creating a session does not publish it
The system SHALL use a soft workflow: creating a session MUST NOT publish it or set `published_at`.

#### Scenario: published_at set only on publish
- **WHEN** the admin creates a session
- **THEN** `published_at` is unset
- **AND** the session is not listable on the public site

#### Scenario: Publish sets published_at
- **WHEN** the admin later publishes the session
- **THEN** the system sets `published_at` and visibility `public`
