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

export type RouteKey = keyof typeof ROUTES;
