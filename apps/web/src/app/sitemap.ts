import { formatGameSlug } from "@fe-template/mocks";
import type { MetadataRoute } from "next";
import { ROUTES } from "@/constants/routes";
import { fetchPublicGames } from "@/hooks/use-public-games/server";
import { fetchPublicPlayers } from "@/hooks/use-public-players/server";
import { fetchPublicSession, fetchPublicSessions } from "@/hooks/use-public-sessions/server";
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

  const sessionSlugs = sessions
    .map((session) => session.slug)
    .filter((slug): slug is string => Boolean(slug));

  const details = await Promise.all(sessionSlugs.map((slug) => fetchPublicSession(slug)));

  const publicPlayerNames = new Set<string>();
  const publicVenueNames = new Set<string>();

  for (const session of sessions) {
    for (const name of session.playerNames) {
      publicPlayerNames.add(name);
    }
    if (session.venueName) {
      publicVenueNames.add(session.venueName);
    }
  }

  for (const game of games) {
    for (const team of game.teams) {
      for (const player of team.players) {
        publicPlayerNames.add(player.displayName);
      }
    }
  }

  const gamePaths: string[] = [];
  for (const detail of details) {
    if (!detail) continue;
    for (const game of detail.games) {
      if (game.gameNumber == null) continue;
      gamePaths.push(ROUTES.game(formatGameSlug(detail.session.sessionDate, game.gameNumber)));
    }
  }

  const playerPaths = players.flatMap((player) =>
    player.slug && publicPlayerNames.has(player.displayName) ? [ROUTES.player(player.slug)] : [],
  );
  const venuePaths = venues.flatMap((venue) =>
    venue.slug && publicVenueNames.has(venue.name) ? [ROUTES.venue(venue.slug)] : [],
  );

  const paths = [
    ROUTES.home,
    ROUTES.sessions,
    ROUTES.players,
    ROUTES.venues,
    ...sessionSlugs.map((slug) => ROUTES.session(slug)),
    ...gamePaths,
    ...playerPaths,
    ...venuePaths,
  ];

  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
