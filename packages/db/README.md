# `@fe-template/db`

Prisma 6 Playmates schema, migrations, seed data, and the shared `PrismaClient` singleton for the monorepo. The database target is **Supabase Postgres only** (hosted project or local `supabase start`). Plain Postgres is not supported.

Consumed by [`apps/admin`](../../apps/admin/README.md) (auth/profile) and available to [`apps/web`](../../apps/web/README.md). Playmates pages still go through `@fe-template/mocks` until the `getPlaymatesRepos()` swap. See [`docs/api-and-data-fetching.md`](../../docs/api-and-data-fetching.md).

---

## Import

```ts
import { prisma } from "@fe-template/db";

const players = await prisma.player.findMany({ where: { isArchived: false } });
```

Generated Prisma types are re-exported too, so `import type { Session, Role } from "@fe-template/db"` works without depending on `@prisma/client` directly.

The client is a singleton cached on `globalThis` outside production, which keeps Next.js dev hot-reloads from opening a new connection pool on every rebuild. Query it from Server Components and Server Actions only — never from a `"use client"` component.

---

## Schema

Prisma's split-schema layout, configured via `schema` and `migrations.seed` in [prisma.config.ts](prisma.config.ts):

```text
packages/db/prisma/
├── schema/
│   ├── schema.prisma
│   ├── profile.prisma
│   ├── player.prisma
│   ├── venue.prisma
│   ├── session.prisma
│   ├── game.prisma
│   ├── recording.prisma
│   ├── provider.prisma
│   ├── post.prisma
│   └── migrations/
└── seed.ts
```

See [`packages/db/docs/README.md`](docs/README.md) for the model list. `Profile.id` has a **required** cross-schema FK to `auth.users(id)` `ON DELETE CASCADE`, applied in `20260914132156_init_playmates` (not expressible in Prisma).

---

## Commands

Run from the repo root with `pnpm --filter @fe-template/db <script>`:

| Script | Purpose |
| --- | --- |
| `db:generate` | Generate the Prisma client (run after install and after schema changes) |
| `db:migrate` | Create and apply a migration in development |
| `db:migrate:create` | Create a migration without applying it (`--create-only`) |
| `db:deploy` | Apply pending migrations (CI / production) |
| `db:push` | Push the schema without a migration (prototyping only) |
| `db:studio` | Open Prisma Studio to browse and edit rows |
| `db:seed` | Seed demo venues, courts, and players. `Profile` is never invented. |
| `typecheck` | `tsc --noEmit` |

`pnpm db:generate` at the repo root runs `db:generate` across the workspace via Turbo.

`db:migrate` and `db:deploy` run `scripts/assert-supabase-auth.ts` first. That preflight checks for `auth.users` and exits with a clear error on plain Postgres.

---

## Supported database targets

| Target | Supported? | Notes |
| --- | --- | --- |
| Hosted Supabase Postgres | Yes | Production and shared-dev default. Includes `auth.users`. |
| Local Supabase (`supabase start`) | Yes | Required path for running migrations on a machine without a cloud project. |
| Plain Postgres (Docker, CI, other hosts) | No | No `auth` schema. |

Do **not** drop `profiles_id_fkey` to make plain Postgres work.

### Local migrations (`supabase start`)

1. Install the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).
2. From a directory with a Supabase project (or `supabase init` if you are bootstrapping local-only), start the stack:

```bash
supabase start
```

3. Copy the local database URL from the CLI output (default is typically `postgresql://postgres:postgres@127.0.0.1:54322/postgres`) into `packages/db/.env` for both `DATABASE_URL` and `DIRECT_URL`.
4. Run migrations against that instance:

```bash
pnpm --filter @fe-template/db db:migrate
```

`db:push` does **not** create `profiles_id_fkey` (the FK is raw SQL, not in `profile.prisma`). Use migrate against Supabase, not `db:push`, when you need the real schema.

---

## Environment

`prisma.config.ts` loads [`packages/db/.env`](.env.example) with `dotenv` (Prisma skips automatic `.env` loading when a config file is present). The package keeps its own copy rather than using the root `.env`:

```bash
cp packages/db/.env.example packages/db/.env
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Connection used by the client at runtime |
| `DIRECT_URL` | Session-mode or direct connection used for migrations (`directUrl` in `schema.prisma`) |

### Pooled vs direct connections

Supabase offers two connection strings, and they are not interchangeable:

- **Pooled** (`aws-0-<region>.pooler.supabase.com:6543`, with `?pgbouncer=true`) — use for `DATABASE_URL` in production and any serverless deployment.
- **Session-mode pooler** (`aws-0-<region>.pooler.supabase.com:5432`) — use for `DIRECT_URL` when the IPv6-only `db.<project-ref>.supabase.co:5432` host is unreachable. Migrations need a non-transaction-pooler connection.

Local development can point both at the same reachable URL.

---

## First-time setup

```bash
cp packages/db/.env.example packages/db/.env       # fill in your Supabase credentials
pnpm --filter @fe-template/db db:migrate           # create the schema
pnpm --filter @fe-template/db db:seed              # optional demo data
pnpm --filter @fe-template/db db:generate          # generate the client
```
