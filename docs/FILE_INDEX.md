# File Index

Product documentation (numbered folders) is the Playmates source of truth. Monorepo / template engineering docs live as siblings in this same `docs/` tree — see [`README.md`](README.md).

## Product docs

- `00-foundation/assumptions-and-open-questions.md`
- `00-foundation/glossary.md`
- `00-foundation/product-vision.md`
- `00-foundation/scope.md`
- `01-product/business-model.md`
- `01-product/business-rules.md`
- `01-product/naming-conventions.md`
- `01-product/user-roles.md`
- `02-domain/domain-model.md`
- `02-domain/game-and-team-model.md`
- `02-domain/provider-assets.md`
- `02-domain/recording-model.md`
- `02-domain/session-model.md`
- `03-data/database-schema.md`
- `03-data/indexes-and-constraints.md`
- `03-data/rls-and-security.md`
- `04-workflows/import-and-pairing.md`
- `04-workflows/player-assignment.md`
- `04-workflows/retry-and-recovery.md`
- `04-workflows/session-to-publish.md`
- `05-integrations/facebook.md`
- `05-integrations/google-drive.md`
- `05-integrations/google-oauth.md`
- `05-integrations/provider-interface.md`
- `05-integrations/youtube.md`
- `06-ui/admin-session-workspace.md`
- `06-ui/branding.md`
- `06-ui/information-architecture.md`
- `06-ui/jabkit-guidelines.md`
- `06-ui/public-site.md`
- `07-engineering/architecture.md`
- `07-engineering/error-handling.md`
- `07-engineering/observability.md`
- `07-engineering/state-machines.md`
- `07-engineering/testing-strategy.md`
- `07-engineering/upload-architecture.md`
- `08-implementation/backlog.md`
- `08-implementation/mvp-acceptance-criteria.md`
- `08-implementation/phased-plan.md`
- `09-ai-prompts/00-master-repository-prompt.md`
- `09-ai-prompts/01-foundation-prompt.md`
- `09-ai-prompts/02-recording-workspace-prompt.md`
- `09-ai-prompts/03-google-integration-prompt.md`
- `09-ai-prompts/04-publishing-prompt.md`
- `10-decisions/ADR-001-no-video-in-supabase.md`
- `10-decisions/ADR-002-game-has-many-recordings.md`
- `10-decisions/ADR-003-facebook-manual-final-step.md`
- `10-decisions/ADR-004-provider-jobs-independent.md`
- `10-decisions/ADR-005-direct-upload.md`
- `10-decisions/ADR-006-jabkit-first.md`
- `README.md`

## Monorepo / template docs

These paths come from `fe-multi-web-template` and describe how to code in this repo, not the Playmates domain.

- `architecture.md`
- `repository-structure.md`
- `development-workflow.md`
- `frontend-conventions.md`
- `api-and-data-fetching.md`
- `styling-and-design-system.md`
- `state-management.md`
- `environment-variables.md`
- `testing.md`
- `deployment.md`
- `dependency-guidelines.md`
- `documentation-guidelines.md`
- `component-guide.md`
- `llm/CONTEXT.md`
- `llm/PATTERNS.md`
- `llm/PROMPTS.md`
- `template/README.md`
- `template/PAGES.md`
- `template/COMPONENTS.md`
- `template/HOOKS.md`
- `about-example-site/` (PawPair starter brand)
- `superpowers/plans/`
- `superpowers/specs/`
- `templates/app-documentation-template.md`
- `templates/package-documentation-template.md`
- `templates/local-agents-template.md`

App- and package-local docs live under `apps/*/docs/` and `packages/*/docs/` (see each workspace `AGENTS.md`).
