# ADR-006 — Jabkit-First UI

## Status
Accepted

## Decision

Use the existing Jabkit component library for generic UI.

## Rule

Before creating a reusable UI primitive:
- inspect Jabkit
- reuse an existing component if practical

## Custom UI is justified for domain behavior

Examples:
- recording organization board
- camera side lanes
- provider upload matrix
- game matchup editor

The app should not create a competing design system.
