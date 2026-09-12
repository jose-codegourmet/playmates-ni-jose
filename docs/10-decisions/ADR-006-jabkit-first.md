# ADR-006 — Jabkit-First UI

## Status
Amended

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

## Amendment (2026-09-12)

The original decision is amended to a **hybrid UI boundary**. Do not treat this ADR as “Jabkit everywhere” or as “never introduce Jabkit.”

- **Public site visual/marketing blocks** (hero, gallery, footer, navbar, count-up, cards with motion): install **JabKit** with `@jabkit/cli` into `apps/web/src/components/jabkit`.
- **Admin and all form/table primitives** (tables, forms, dialogs, sheets, sidebar, command palette, and similar): use **`@fe-template/ui`**. Admin must not run `jabkit init`.
- **Domain widgets** stay **app-local** (`apps/web/src/sections/...`, `apps/admin/src/modules/...`), composed on top of those two libraries.
- **Do not add JabKit as an npm workspace package.** Source-copy via the CLI only.

The operational detail lives in [`ROADMAP/00-conventions.md`](../../ROADMAP/00-conventions.md).
