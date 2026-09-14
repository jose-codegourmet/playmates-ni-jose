import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { PAGE_SEO } from "@/constants/seo";
import { fetchPublicGames } from "@/hooks/use-public-games/server";
import { fetchPublicPlayers } from "@/hooks/use-public-players/server";
import { fetchPublicSessions } from "@/hooks/use-public-sessions/server";
import { fetchCalendarSessions } from "@/sections/home/hero/calendar-data";
import { HomeHeroSection } from "@/sections/home/hero/HomeHeroSection";
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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  openGraph: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    url: ROUTES.home,
  },
};

export default async function HomePage() {
  const [sessions, games, players, calendarSessions] = await Promise.all([
    fetchPublicSessions(),
    fetchPublicGames(),
    fetchPublicPlayers(),
    fetchCalendarSessions(),
  ]);

  return (
    <>
      <HomeHeroSection
        sessions={calendarSessions}
        today={new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Manila",
        })}
      />
      <LatestSessionsSection
        className="nb-band bg-accent-mango"
        sessions={toLatestSessionCards(sessions)}
      />
      <RecentGamesSection className="nb-band bg-background" games={toRecentGameCards(games)} />
      <PlayersStripSection
        className="nb-band bg-accent-sky"
        players={toPlayersStripCards(players, sessions)}
      />
    </>
  );
}
