export const DEFAULT_SEO = {
  title: "Playmates ni José — Badminton archive",
  description:
    "Public archive of Playmates ni José badminton sessions, games, players, and published recordings.",
  ogImage: "/images/mascot/og.png",
  siteName: "Playmates ni José",
  tagline: "Games, sides, and the links that matter.",
} as const;

export const PAGE_SEO = {
  home: {
    title: "Playmates ni José — Badminton archive",
    description:
      "Public archive of Playmates ni José badminton sessions, games, players, and published recordings.",
  },
  sessions: {
    title: "Sessions | Playmates ni José",
    description: "Browse badminton sessions in the Playmates archive.",
  },
  session: {
    titleTemplate: "%s — Session | Playmates ni José",
    description: "Games, sides, and recordings from one Playmates session.",
  },
  game: {
    titleTemplate: "%s | Playmates ni José",
    description: "A single game from the Playmates archive.",
  },
  players: {
    title: "Players | Playmates ni José",
    description: "Players who appear in Playmates ni José sessions.",
  },
  player: {
    titleTemplate: "%s — Player | Playmates ni José",
    description: "Session history and recordings for one player.",
  },
  venues: {
    title: "Venues | Playmates ni José",
    description: "Courts and venues where Playmates sessions were played.",
  },
  venue: {
    titleTemplate: "%s — Venue | Playmates ni José",
    description: "Sessions recorded at this venue.",
  },
  notFound: {
    title: "Not found | Playmates ni José",
    description: "This page is not in the Playmates archive.",
  },
} as const;

export type DefaultSeo = typeof DEFAULT_SEO;
export type PageSeo = typeof PAGE_SEO;
export type PageSeoKey = keyof PageSeo;
export type StaticPageSeoKey = {
  [K in PageSeoKey]: "title" extends keyof PageSeo[K] ? K : never;
}[PageSeoKey];
export type TemplatedPageSeoKey = {
  [K in PageSeoKey]: "titleTemplate" extends keyof PageSeo[K] ? K : never;
}[PageSeoKey];

export function formatPageTitle(key: TemplatedPageSeoKey, name: string): string {
  return PAGE_SEO[key].titleTemplate.replace("%s", name);
}
