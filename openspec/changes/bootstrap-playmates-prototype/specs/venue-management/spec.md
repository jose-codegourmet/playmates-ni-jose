## Purpose

Venues are physical play locations with optional courts. Sessions may omit venue and court. A court, when set, must belong to the selected venue.

## ADDED Requirements

### Requirement: Venue name and unique slug
The system SHALL require a venue name. Address and notes SHALL be optional. The venue slug SHALL be unique.

#### Scenario: Create venue with optional fields omitted
- **WHEN** the admin creates a venue with only a name
- **THEN** the system persists the venue with a unique slug

### Requirement: Courts belong to a venue
The system SHALL allow a venue to have zero or more courts. Each court SHALL have `name`, `sort_order`, and `is_archived`.

#### Scenario: Create venue plus two courts
- **WHEN** the admin creates a venue and adds two courts
- **THEN** both courts store name, sort_order, and is_archived under that venue

### Requirement: Optional venue and court on session
The system SHALL treat `session.venue_id` and `session.court_id` as optional. If `court_id` is set, the court MUST belong to the selected venue.

#### Scenario: Session with no venue is allowed
- **WHEN** the admin creates or updates a session without venue or court
- **THEN** the system accepts the session

#### Scenario: Assign court from another venue is rejected
- **WHEN** the admin assigns a court that does not belong to the session's venue
- **THEN** the system rejects the assignment
