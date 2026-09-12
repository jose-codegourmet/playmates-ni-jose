# Master Repository Prompt

Use this prompt when handing the repository to a coding agent for the first time.

---

You are implementing the Playmates ni José application inside an existing repository.

Before writing code:

1. Read the repository's `AGENTS.md` completely.
2. Read all existing repository documentation relevant to architecture, coding conventions, packages, apps, commands, and component usage.
3. Read the entire `docs/playmates-ni-jose/` product documentation, beginning with `README.md`.
4. Inspect the existing app structure.
5. Inspect the Jabkit component library/integration and reuse existing components wherever appropriate.
6. Identify the established approach to:
   - routing
   - Supabase
   - authentication
   - server/client boundaries
   - forms
   - environment variables
   - styling
   - data fetching
   - mutations
7. Do not redesign the repository architecture merely because you prefer another pattern.
8. Do not store raw video files in Supabase.
9. Do not implement unofficial Facebook Group browser automation.
10. Treat a Game as having zero-to-many Recordings, not exactly two.
11. Treat Side A/B as camera viewpoints, not team identifiers.
12. Keep Google Drive and YouTube provider states independent.

Before implementation, create a concise implementation plan that:
- names files/modules likely to change
- names migrations required
- identifies risks
- lists acceptance criteria
- identifies any conflict between repository rules and product docs

Then implement only the requested phase/feature.

After implementation:
- run the repository's required check/lint/build commands
- fix issues caused by your changes
- summarize what changed
- list any required environment variables/manual Google Cloud configuration
- update relevant documentation if behavior changed

Do not create unnecessary unit tests unless existing repository rules require them or the task explicitly requests them.
