import { formatGameSlug } from "@fe-template/mocks";
import type { MetadataRoute } from "next";
import { ROUTES } from "@/constants/routes";
import { fetchPublicGames } from "@/hooks/use-public-games/server";
import { fetchPublicPlayers } from "@/hooks/use-public-players/server";
import { fetchPublicSessions } from "@/hooks/use-public-sessions/server";
import { fetchPublicVenues } from "@/hooks/use-public-venues/server";

const FALLBACK_SITE_URL = "http://localhost:9000";

function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/$/, "");
}

function absoluteUrl(path: string): string {
  return new URL(path, `${siteOrigin()}/`).href;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sessions, games, players, venues] = await Promise.all([
    fetchPublicSessions(),
    fetchPublicGames(),
    fetchPublicPlayers(),
    fetchPublicVenues(),
  ]);

  const sessionPaths = sessions
    .map((session) => session.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ROUTES.session(slug));

  const gamePaths = games.flatMap((game) =>
    game.gameNumber == null
      ? []
      : [ROUTES.game(formatGameSlug(game.sessionDate, game.gameNumber))],
  );

  const playerPaths = players.flatMap((player) =>
    player.slug ? [ROUTES.player(player.slug)] : [],
  );
  const venuePaths = venues.flatMap((venue) => (venue.slug ? [ROUTES.venue(venue.slug)] : []));

  const paths = [
    ROUTES.home,
    ROUTES.sessions,
    ROUTES.players,
    ROUTES.venues,
    ...sessionPaths,
    ...gamePaths,
    ...playerPaths,
    ...venuePaths,
  ];

  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
