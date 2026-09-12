# Testing Strategy

The user has previously preferred not to spend large token budgets on heavy unit-test creation.

For this app, prioritize practical validation.

## Minimum

- TypeScript passes
- lint/check passes
- production build passes
- Supabase migrations apply cleanly
- key workflows manually verified

## High-value integration checks

- create session
- add players
- create games
- attach 1 recording
- attach >2 recordings to one game
- upload Drive only
- upload YouTube only
- one provider fails while the other succeeds
- retry
- publish game
- public page does not expose private session

## Avoid initially

- exhaustive snapshot tests
- large component unit-test suites
- tests that duplicate browser/library behavior

If the existing repository mandates tests, follow repository rules.
