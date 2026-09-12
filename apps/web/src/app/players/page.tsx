import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { PAGE_SEO } from "@/constants/seo";
import { fetchPublicGames } from "@/hooks/use-public-games/server";
import { fetchPublicPlayers } from "@/hooks/use-public-players/server";
import { fetchPublicSessions } from "@/hooks/use-public-sessions/server";
import { PlayersGridSection, toPlayersGridCards } from "@/sections/players/grid/PlayersGridSection";
import { PlayersHeroSection } from "@/sections/players/hero/PlayersHeroSection";

export const metadata: Metadata = {
  title: PAGE_SEO.players.title,
  description: PAGE_SEO.players.description,
  openGraph: {
    title: PAGE_SEO.players.title,
    description: PAGE_SEO.players.description,
    url: ROUTES.players,
  },
};

export default async function PlayersPage() {
  const [players, sessions, games] = await Promise.all([
    fetchPublicPlayers(),
    fetchPublicSessions(),
    fetchPublicGames(),
  ]);

  return (
    <>
      <PlayersHeroSection />
      <PlayersGridSection players={toPlayersGridCards(players, sessions, games)} />
    </>
  );
}
