## Purpose

Google Drive and YouTube uploads are independent simulated jobs. No bytes leave the machine. Trace: ADR-001, ADR-004, `docs/07-engineering/state-machines.md`, retry-and-recovery.

## ADDED Requirements

### Requirement: Independent providers
The system SHALL support providers `google_drive` and `youtube`. Jobs for each provider SHALL be independent.

#### Scenario: Drive complete and YouTube fail
- **WHEN** Drive is completed and YouTube has failed
- **THEN** the Drive job stays completed
- **AND** retry applies only to YouTube

### Requirement: Upload job status machine
The system SHALL use job status `queued` → `initiating` → `uploading` → `processing` → `completed`, or `failed` / `cancelled`. Retry SHALL move `failed` or `cancelled` to `queued`.

#### Scenario: Failed job shows error and retry
- **WHEN** a job fails
- **THEN** the UI shows error copy and a retry action
- **AND** retry sets status to `queued`

#### Scenario: Cancel in-flight
- **WHEN** the admin cancels an in-flight job
- **THEN** status becomes `cancelled`
- **AND** the admin can restart it to `queued`

### Requirement: Prototype simulates progress
The prototype SHALL simulate upload progress. No bytes SHALL leave the machine.

#### Scenario: Simulated progress
- **WHEN** the admin starts an upload in the prototype
- **THEN** progress is visible
- **AND** no file bytes are sent to Drive, YouTube, or remote storage

### Requirement: Retry does not reset the other provider
Retrying YouTube MUST NOT reset a completed Drive job.

#### Scenario: Retry YouTube only
- **WHEN** the admin retries a failed YouTube job after Drive completed
- **THEN** the completed Drive job and asset remain unchanged

### Requirement: Replace completed asset explicitly
If a completed `provider_asset` exists, starting another upload SHALL require an explicit replace.

#### Scenario: Second upload needs replace
- **WHEN** a completed provider asset exists and the admin starts another upload for that provider
- **THEN** the system requires an explicit replace confirmation

### Requirement: Reselect local file when handle missing
The system SHALL require the admin to reselect the local file when the File handle is missing and the job still needs bytes.

#### Scenario: Missing handle blocks upload
- **WHEN** the File handle is gone and the admin starts or retries an upload that needs bytes
- **THEN** the UI requires reselecting the local file
