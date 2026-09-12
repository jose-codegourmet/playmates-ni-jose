# ADR-004 — Provider Uploads Are Independent

## Status
Accepted

## Decision

Google Drive and YouTube upload states are tracked separately.

## Example

```text
Recording 7
Drive: completed
YouTube: failed
```

Retrying YouTube must not trigger another Drive upload.

## Reason

Providers have different:
- quotas
- errors
- processing delays
- permissions
- privacy settings

Independent jobs make failure recovery predictable.
