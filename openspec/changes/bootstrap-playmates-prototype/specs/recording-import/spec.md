## Purpose

Import captures local file metadata into the mock store with stable UUIDs. The browser File is not persisted. Trace: `docs/02-domain/recording-model.md`, `docs/04-workflows/import-and-pairing.md`.

## ADDED Requirements

### Requirement: Import captures file metadata
The system SHALL capture original filename, mime, size, lastModified, and optional duration for each imported recording.

#### Scenario: Drop 21 files yields 21 rows
- **WHEN** the admin drops 21 local video files onto import
- **THEN** the system creates 21 recording rows with those metadata fields

### Requirement: Filename is not identity
The system SHALL assign each recording a stable UUID. Filename MUST NOT be identity. Duplicate names SHALL be allowed.

#### Scenario: Two files named IMG_1001.MOV
- **WHEN** the admin imports two files both named `IMG_1001.MOV`
- **THEN** both recordings are stored with distinct UUIDs

### Requirement: Default assignment fields
The system SHALL persist `game_id` as nullable, `camera_side` default `UNASSIGNED`, and `part_number` default 1.

#### Scenario: Fresh import is unassigned
- **WHEN** a recording is imported and not organized
- **THEN** `game_id` is null, `camera_side` is `UNASSIGNED`, and `part_number` is 1

### Requirement: Metadata persists without the File
The system SHALL persist metadata immediately in the mock store. The browser `File` MUST NOT be persisted.

#### Scenario: Metadata survives without bytes
- **WHEN** import completes
- **THEN** metadata rows remain in the mock store
- **AND** the File object is not written to durable storage

### Requirement: Reselect after reload
After reload, the UI MUST tell the admin that the local file must be reselected if an upload still needs bytes.

#### Scenario: Refresh loses File handles
- **WHEN** the admin refreshes after import and an upload still needs bytes
- **THEN** the UI shows that the local file must be reselected
