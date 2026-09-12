# Publishing

## Purpose

Publication is an explicit admin action independent of upload completion. Public pages show only public records. Trace: `docs/01-product/business-rules.md` (Publication).

## Requirements

### Requirement: Publish is explicit
The system SHALL publish only when the admin publishes. Completing uploads MUST NOT auto-publish.

#### Scenario: Uploads do not publish
- **WHEN** all provider jobs for a session complete
- **THEN** the session remains unpublished until the admin publishes

### Requirement: Incomplete providers warn only
The admin MAY publish a game with only YouTube, only Drive, both, or neither. The UI SHALL warn when a provider is missing and MUST NOT hard-fail.

#### Scenario: Publish session with one game missing YouTube
- **WHEN** the admin publishes a session where one game lacks YouTube after a dismissible warning
- **THEN** the session publishes
- **AND** the missing provider does not block publish

### Requirement: Session listable when public and published_at
Session `visibility=public` plus `published_at` SHALL make the session listable. Individual games SHALL have their own visibility.

#### Scenario: Draft session never appears on /sessions
- **WHEN** a session is still draft (not public / no `published_at`)
- **THEN** it never appears on public `/sessions`

### Requirement: Public site filters to public records
The public site SHALL show only `visibility=public` records.

#### Scenario: Visitor sees Sep 9 published session
- **WHEN** the Sep 9 session is public with `published_at` set
- **THEN** a visitor can see it on public lists

### Requirement: Unpublish hides from public lists
Unpublish SHALL return the session to private and hide it from public lists.

#### Scenario: Unpublish hides it
- **WHEN** the admin unpublishes a previously public session
- **THEN** visibility is private
- **AND** the session disappears from public lists
