# `@fe-template/db` Development

How to develop against the Prisma schema, run migrations, and validate the package.

---

## Package structure

```text
packages/db/
├── src/
│   ├── client.ts          # PrismaClient singleton
│   └── index.ts           # Public exports
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma
│   │   ├── profile.prisma
│   │   ├── player.prisma
│   │   ├── venue.prisma
│   │   ├── session.prisma
│   │   ├── game.prisma
│   │   ├── recording.prisma
│   │   ├── provider.prisma
│   │   ├── post.prisma
│   │   └── migrations/    # Prisma migrations
│   └── seed.ts            # Seed script
├── prisma.config.ts       # schema path + seed command
├── package.json
└── tsconfig.json
```

---

## Multi-file schema

Prisma is configured in `prisma.config.ts` (not `package.json`):

```ts
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnv({ path: resolve(import.meta.dirname, ".env"), quiet: true });

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/schema/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
```

Keep models grouped by domain. `schema.prisma` contains the generator and datasource.

---

## Migration workflow

1. Edit the relevant `.prisma` file.
2. Run migrations in development:

```bash
pnpm --filter @fe-template/db db:migrate
```

3. Generate the client:

```bash
pnpm --filter @fe-template/db db:generate
```

4. Apply in production/CI:

```bash
pnpm --filter @fe-template/db db:deploy
```

`db:migrate` and `db:deploy` run `scripts/assert-supabase-auth.ts` first. That script queries `to_regclass('auth.users')::text` and exits if the relation is missing.

---

## Supabase `auth.users` requirement

`20260914132156_init_playmates` ends with:

```sql
ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_id_fkey"
  FOREIGN KEY ("id") REFERENCES auth.users(id) ON DELETE CASCADE;
```

`auth.users` is a Supabase Auth table. It is **not** created by Prisma.

| Target | What happens |
|---|---|
| Hosted Supabase | Migration applies. FK already exists on environments that have run this migration. |
| `supabase start` | Local stack includes `auth.users`. Point `DATABASE_URL` / `DIRECT_URL` at the local URL, then migrate. |
| Plain Postgres | Preflight fails with a documented error. Without the preflight, Prisma fails on the missing `auth.users` relation. |

Do **not** drop the FK to support generic Postgres — `Profile` is keyed to Supabase Auth users.

`db:push` will create the `profiles` table without `profiles_id_fkey`. That is not a supported substitute for migrate on a real environment.

---

## Prototyping without migrations

For rapid local iteration only:

```bash
pnpm --filter @fe-template/db db:push
```

**Do not use `db:push` in production or shared environments.** It does not create migration files and can lose data.

---

## Seeding

```bash
pnpm --filter @fe-template/db db:seed
```

`prisma/seed.ts` upserts a couple of venues, courts, and players. It does **not** invent `Profile` rows. `Profile.id` must be a real `auth.users` UUID.

---

## Pooled vs direct URLs

- `DATABASE_URL` should use the pooled connection (`*.pooler.supabase.com:6543?pgbouncer=true`) in production/serverless.
- `DIRECT_URL` must use a session-mode pooler (`*.pooler.supabase.com:5432`) or the direct host (`db.<project-ref>.supabase.co:5432`) for migrations. The direct host is IPv6-only on hosted Supabase.
- Local development can point both to the same reachable URL.

`prisma.config.ts` loads `packages/db/.env` with `dotenv` because Prisma 6 skips automatic `.env` loading when a config file is present.

See `docs/environment-variables.md` for the full matrix.

---

## Validation commands

| Command | Purpose |
|---|---|
| `pnpm --filter @fe-template/db typecheck` | TypeScript check |
| `pnpm --filter @fe-template/db db:generate` | Generate Prisma client |
| `pnpm --filter @fe-template/db db:migrate` | Preflight `auth.users`, then create and apply migration |
| `pnpm --filter @fe-template/db db:seed` | Seed demo data |
| `pnpm lint` | Biome across the repo |

---

## How to safely change the package

1. Edit the schema file(s).
2. Create and apply a migration.
3. Generate the client.
4. Update `packages/db/docs/README.md` and `packages/db/docs/api.md` if the public API changed.
5. Identify all consumers (`apps/admin`, `apps/web`) and update their imports if needed.
6. Run type-checking and builds for affected consumers.
7. Seed or migrate data as needed.

---

## How to validate consuming apps

After schema changes, run:

```bash
pnpm --filter @fe-template/db db:generate
pnpm --filter admin typecheck
pnpm --filter web typecheck
pnpm --filter admin build
pnpm --filter web build
```

If a migration is required, run `db:migrate` before `db:generate`.
