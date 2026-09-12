# Prompt — Foundation

Implement Phase 1 from `08-implementation/phased-plan.md`.

Scope:
- admin authentication/authorization using the repository's existing Supabase conventions
- profiles/admin access
- Players CRUD
- Venues CRUD
- optional Courts CRUD if it fits cleanly
- Sessions CRUD
- public/private visibility primitives

Requirements:
- use migrations, not ad-hoc dashboard-only changes
- apply RLS
- public users must not read private sessions
- archived players/venues should remain referentially valid
- use Jabkit
- no raw media work yet
- no Google OAuth yet

Before coding, read the domain/data docs and produce a plan.

Done when the relevant acceptance criteria for Phase 1 are satisfied and the production build/check passes.
