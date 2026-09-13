import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { PAGE_SEO } from "@/constants/seo";
import { fetchPublicGames } from "@/hooks/use-public-games/server";
import { fetchPublicPlayers } from "@/hooks/use-public-players/server";
import { fetchPublicSessions } from "@/hooks/use-public-sessions/server";
import { HomeHeroSection } from "@/sections/home/hero/HomeHeroSection";
import type { HomeHeroPortrait } from "@/sections/home/hero/HomeHeroSection.types";
import {
  LatestSessionsSection,
  toLatestSessionCards,
} from "@/sections/home/latest-sessions/LatestSessionsSection";
import {
  PlayersStripSection,
  toPlayersStripCards,
} from "@/sections/home/players-strip/PlayersStripSection";
import {
  RecentGamesSection,
  toRecentGameCards,
} from "@/sections/home/recent-games/RecentGamesSection";

const PORTRAIT_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  openGraph: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    url: ROUTES.home,
  },
};

function toHeroPortraits(
  players: Awaited<ReturnType<typeof fetchPublicPlayers>>,
): HomeHeroPortrait[] {
  return players.slice(0, 5).map((player) => ({
    name: player.displayName,
    src: PORTRAIT_PLACEHOLDER,
    alt: player.displayName,
  }));
}

export default async function HomePage() {
  const [sessions, games, players] = await Promise.all([
    fetchPublicSessions(),
    fetchPublicGames(),
    fetchPublicPlayers(),
  ]);

  return (
    <>
      <HomeHeroSection
        sessionCount={sessions.length}
        gameCount={games.length}
        portraits={toHeroPortraits(players)}
      />
      <LatestSessionsSection sessions={toLatestSessionCards(sessions)} />
      <RecentGamesSection games={toRecentGameCards(games)} />
      <PlayersStripSection players={toPlayersStripCards(players, sessions)} />
    </>
  );
}
