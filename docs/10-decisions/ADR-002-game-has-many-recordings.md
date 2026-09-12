# ADR-002 — A Game Has Zero-to-Many Recordings

## Status
Accepted

## Decision

Do not model Game as:

```text
side_a_video
side_b_video
```

Model:

```text
Game -> many Recordings
```

Each recording has:
- camera side
- part number
- sort order

## Reason

Real-world recording can be interrupted.

A single game may have:
- two normal recordings
- one camera only
- several parts on one side
- several parts on both sides

## Consequence

UI must make grouping and ordering easy, but schema remains correct for every case.
