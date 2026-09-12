# Metadata — two tracks

There are two different “meta” systems. Do not mix them.

| Track | What it is | Where it lives |
|---|---|---|
| A. Component `meta.ts` | Catalogue descriptor for a UI block, modeled on JabKit | Next to every new domain component and every new web section |
| B. Next.js metadata | SEO / social / crawl | `apps/web/src/constants/seo.ts`, `routes.ts`, `navigation.ts`, `generateMetadata`, `sitemap.ts`, `robots.ts` |

Admin pages need Track B only as `title` on the dashboard header (already a `TITLES` map). Do not add Open Graph to admin.

---

## Track A — `{Name}.meta.ts`

JabKit library components already ship `Button.meta.ts` etc. After CLI install they land under `apps/web/src/components/jabkit/`. **Do not invent a second meta file for an installed JabKit block** unless you wrap it.

Every **new** Playmates section or domain widget we author MUST include `ComponentName.meta.ts`.

### Shared type

Create this once in PNJ-011 or a tiny `packages/mocks`/`packages/config` type file. Prefer:

`packages/config/src/component-meta.ts` exported as `@fe-template/config` **or** a local type duplicated in each app if you do not want to grow `packages/config` yet.

Recommended: add the type to `packages/config` and point both apps at it. If `packages/config` is still a stub (`package.json` only), PNJ-011b / include this in PNJ-006 or a dedicated step inside PNJ-011.

```ts
export type PlaymatesComponentMeta = {
  name: string; // kebab-case, unique in the app
  displayName: string;
  version: string; // start "0.1.0"
  addedAt: string; // ISO date YYYY-MM-DD
  description: string;
  sectionCategory:
    | "layout"
    | "hero"
    | "listing"
    | "detail"
    | "form"
    | "workflow"
    | "media"
    | "status"
    | "social";
  purpose: string;
  bestFor: string[];
  tone: string[];
  contentDensity: "low" | "medium" | "high";
  visualWeight: "low" | "medium" | "high";
  layout: { type: "stack" | "split" | "grid" | "board" | "table"; alignment?: string };
  slots: string[];
  capabilities: {
    supportsImage: boolean;
    supportsVideo: boolean;
    supportsForm: boolean;
    supportsCTA: boolean;
    supportsDarkMode: boolean;
  };
  tags: string[];
  dependencies: string[]; // npm
  registryDependencies: string[]; // jabkit names or @fe-template/ui names
  a11y: { keyboardNav: boolean; reducedMotion: boolean };
  preview: { layout: "center" | "fullscreen" | "padded"; capture: { themes: Array<"light" | "dark"> } };
};
```

This mirrors JabKit’s `ComponentMeta` closely so a later publish-to-registry story is possible. We do **not** run JabKit’s registry builder inside this repo.

### Example — `GameCard.meta.ts`

```ts
import type { PlaymatesComponentMeta } from "@fe-template/config";

export default {
  name: "game-card",
  displayName: "Game Card",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Public or admin card for one game: number, matchup, recording count, provider actions.",
  sectionCategory: "listing",
  purpose: "Let a visitor or admin scan a session’s games and open the detail.",
  bestFor: ["session detail game list", "home recent games"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["gameNumber", "matchup", "videoCount", "youtubeAction", "driveAction"],
  capabilities: {
    supportsImage: true,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["game", "card", "session", "youtube", "drive"],
  dependencies: ["@fe-template/ui"],
  registryDependencies: ["card", "badge", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
```

### Rules for agents

- `name` is kebab-case and matches the folder.
- `registryDependencies` lists primitives you import, not every transitive dep.
- Update `version` only if a later ticket changes the public props.
- Stories should cover at least: default, empty matchup, multi-part recordings, dark theme.

---

## Track B — Next.js / site metadata

### Central constants

Rewrite these three files in PNJ-041 (web). Do not leave PawPair keys.

`apps/web/src/constants/routes.ts`

```ts
export const ROUTES = {
  home: "/",
  sessions: "/sessions",
  session: (slug: string) => `/sessions/${slug}`,
  game: (slug: string) => `/games/${slug}`,
  players: "/players",
  player: (slug: string) => `/players/${slug}`,
  venues: "/venues",
  venue: (slug: string) => `/venues/${slug}`,
} as const;
```

Do not keep `/about`, `/pricing`, `/blog`, `/sign-in` unless a later ticket explicitly restores them. This prototype does not.

`apps/web/src/constants/seo.ts`

```ts
export const DEFAULT_SEO = {
  title: "Playmates ni José — Badminton archive",
  description:
    "Public archive of Playmates ni José badminton sessions, games, players, and published recordings.",
  ogImage: "/images/brand/og-playmates.png", // placeholder allowed
  siteName: "Playmates ni José",
  tagline: "Games, sides, and the links that matter.",
} as const;

export const PAGE_SEO = {
  home: { title: "...", description: "..." },
  sessions: { title: "...", description: "..." },
  session: { titleTemplate: "%s — Session | Playmates ni José", description: "..." },
  game: { titleTemplate: "%s | Playmates ni José", description: "..." },
  players: { title: "...", description: "..." },
  player: { titleTemplate: "%s — Player | Playmates ni José", description: "..." },
  venues: { title: "...", description: "..." },
  venue: { titleTemplate: "%s — Venue | Playmates ni José", description: "..." },
  notFound: { title: "Not found | Playmates ni José", description: "..." },
} as const;
```

`apps/web/src/constants/navigation.ts` — only Home, Sessions, Players, Venues.

### Per-page metadata

Static pages:

```ts
import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";

export const metadata: Metadata = {
  title: PAGE_SEO.sessions.title,
  description: PAGE_SEO.sessions.description,
  openGraph: { title: PAGE_SEO.sessions.title, description: PAGE_SEO.sessions.description },
};
```

Dynamic pages **must** use `generateMetadata`:

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await fetchPublicSession(slug);
  if (!session) return { title: PAGE_SEO.notFound.title };
  return {
    title: `${session.title ?? session.sessionDate} — Session | Playmates ni José`,
    description: `Games from ${session.sessionDate} at ${session.venueName ?? "an unnamed court"}.`,
  };
}
```

Root `apps/web/src/app/layout.tsx` uses `DEFAULT_SEO`.

### Crawl files (PNJ-051)

- `apps/web/src/app/sitemap.ts` — only **public** sessions, games, players, venues from the mock repo.
- `apps/web/src/app/robots.ts` — allow `/`, disallow nothing critical; do not list admin (different origin).
- Optional `apps/web/src/app/opengraph-image.tsx` later; a static PNG placeholder is enough.

### Admin titles

Edit `TITLES` in `apps/admin/src/app/(dashboard)/layout.tsx`:

```ts
const TITLES = {
  "/dashboard": "Dashboard",
  "/sessions": "Sessions",
  "/sessions/new": "New session",
  "/players": "Players",
  "/venues": "Venues",
  "/settings": "Settings",
  "/settings/google": "Google",
  "/settings/publishing": "Publishing",
};
```

Resolve `/sessions/[id]/...` to “Session workspace”.

---

### Ticket reminder

Track A files are created **inside the component tickets** (PNJ-021+ and each public section ticket). Track B is PNJ-006 (partial brand strings), PNJ-041 (full rewrite), PNJ-051 (sitemap/robots). There is no standalone “write all meta.ts” ticket — if you add a component without `meta.ts`, the ticket is incomplete.
