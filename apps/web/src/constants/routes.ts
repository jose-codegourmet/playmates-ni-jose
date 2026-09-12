export const ROUTES = {
  home: "/",
  sessions: "/sessions",
  session: (slug: string): `/sessions/${string}` => `/sessions/${slug}`,
  game: (slug: string): `/games/${string}` => `/games/${slug}`,
  players: "/players",
  player: (slug: string): `/players/${string}` => `/players/${slug}`,
  venues: "/venues",
  venue: (slug: string): `/venues/${string}` => `/venues/${slug}`,
} as const;

export type RouteKey = keyof typeof ROUTES;
export type StaticRouteKey = {
  [K in RouteKey]: (typeof ROUTES)[K] extends string ? K : never;
}[RouteKey];
export type DynamicRouteKey = Exclude<RouteKey, StaticRouteKey>;
