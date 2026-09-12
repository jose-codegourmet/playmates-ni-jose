import { ROUTES } from "./routes";

export const NAV_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "Sessions", href: ROUTES.sessions },
  { label: "Players", href: ROUTES.players },
  { label: "Venues", href: ROUTES.venues },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
export type NavHref = NavLink["href"];
