# Jabkit UI Guidelines

The project should use the existing **Jabkit** component library rather than recreating generic UI.

## Agent instructions

Before creating any shared UI component:

1. Inspect Jabkit.
2. Search for an existing component/block that already solves the need.
3. Reuse or compose existing components.
4. Create app-specific components only when the behavior is domain-specific.

## Good candidates for Jabkit reuse

- buttons
- inputs
- selects
- comboboxes
- dialogs
- sheets
- cards
- tabs
- badges
- tables
- dropdowns
- navigation
- empty states
- progress UI
- alerts
- tooltips
- form primitives
- command/search UI
- pagination
- skeletons

## App-specific components

Likely custom:
- `RecordingDropzone`
- `RecordingCard`
- `GameRecordingBoard`
- `CameraSideLane`
- `GameTeamEditor`
- `UploadProviderStatus`
- `UploadQueue`
- `FacebookPostPreview`
- `SessionPublishChecklist`

## Visual direction

Favor:
- clean utility UI
- high information density in admin
- clear progress indicators
- minimal modal nesting
- responsive but desktop-first for bulk media organization

Do not introduce a second design system.
