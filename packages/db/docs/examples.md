# `@fe-template/db` Examples

Practical examples of using the shared database package in server code.

---

## Server Component query

```tsx
import { prisma } from "@fe-template/db";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    where: { isArchived: false },
    orderBy: { displayName: "asc" },
  });

  return <PlayersTable players={players} />;
}
```

Playmates pages currently read `@fe-template/mocks` instead. Use this pattern after the `getPlaymatesRepos()` swap.

---

## Server Action mutation

```ts
"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";

export async function updateProfileDisplayName(id: string, displayName: string) {
  await prisma.profile.update({
    where: { id },
    data: { displayName },
  });

  revalidatePath("/profile");
}
```

Real reference: `apps/admin/src/app/(dashboard)/profile/actions.ts`.

---

## Using generated types

```ts
import { prisma } from "@fe-template/db";
import type { Role } from "@fe-template/db";

export async function listAdmins() {
  return prisma.profile.findMany({
    where: { role: "ADMIN" satisfies Role },
  });
}
```

---

## Seeding

```ts
// prisma/seed.ts (excerpt)
import { prisma } from "../src/client";

async function main() {
  await prisma.venue.upsert({
    where: { id: "bbbbbbbb-0002-4000-8000-000000000001" },
    update: {},
    create: {
      id: "bbbbbbbb-0002-4000-8000-000000000001",
      name: "Smash Court QC",
      slug: "smash-court-qc",
    },
  });
}

main();
```

Real reference: `packages/db/prisma/seed.ts`. `Profile` is never invented; `id` must be a real `auth.users` UUID.

---

## Profile upsert after Supabase OTP

```ts
"use server";

import { prisma } from "@fe-template/db";

export async function createProfile(userId: string, email: string) {
  await prisma.profile.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email,
    },
    update: {
      email,
    },
  });
}
```

Real reference: `apps/admin/src/modules/auth/otp-form/actions.ts`.

---

## Discouraged usage

- Do not import `@fe-template/db` from client components (`"use client"`).
- Do not instantiate a new `PrismaClient` in app code; use the exported `prisma` singleton.
- Do not use `db:push` in production or shared environments.
- Do not query Playmates entities from pages until `getPlaymatesRepos()` is swapped (see `ROADMAP/11-handoff-to-real-data.md`).
