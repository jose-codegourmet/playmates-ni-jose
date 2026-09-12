# State Machines

## Recording status

Suggested:

```text
imported
organized
ready
uploading
uploaded
published
failed
archived
```

This is convenience state; provider jobs are authoritative for provider status.

## Upload job

```text
queued
initiating
uploading
processing
completed
failed
cancelled
```

Transitions:

```text
queued -> initiating -> uploading -> processing -> completed
                    \-> failed
uploading -> cancelled
failed -> queued (retry)
cancelled -> queued (restart)
```

## Game publication

```text
draft
ready
published
archived
```

## Session publication

Session may be considered published when:
- visibility is public
- published_at exists

Individual games may still have their own visibility.

## Avoid coupled states

Do not make:
`YouTube failed => whole session failed`

Uploads are granular.
