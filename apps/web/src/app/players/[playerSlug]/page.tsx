import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { formatPageTitle, PAGE_SEO } from "@/constants/seo";
import { fetchPublicGamesForPlayer } from "@/hooks/use-public-games/server";
import { fetchPublicPlayer } from "@/hooks/use-public-players/server";
import { fetchPublicSessionsForPlayer } from "@/hooks/use-public-sessions/server";
import {
  PlayerDetailGamesSection,
  toPlayerDetailGameCards,
} from "@/sections/player-detail/games/PlayerDetailGamesSection";
import { PlayerDetailHeaderSection } from "@/sections/player-detail/header/PlayerDetailHeaderSection";
import {
  PlayerDetailSessionsSection,
  toPlayerDetailSessionCards,
} from "@/sections/player-detail/sessions/PlayerDetailSessionsSection";

type PlayerDetailPageProps = {
  params: Promise<{ playerSlug: string }>;
};

export async function generateMetadata({ params }: PlayerDetailPageProps): Promise<Metadata> {
  const { playerSlug } = await params;
  const player = await fetchPublicPlayer(playerSlug);
  if (!player) {
    return {
      title: PAGE_SEO.notFound.title,
      description: PAGE_SEO.notFound.description,
    };
  }

  const title = formatPageTitle("player", player.displayName);
  const description = player.nickname?.trim()
    ? `${player.displayName} (${player.nickname}) in the Playmates archive.`
    : `${player.displayName} in the Playmates archive.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: ROUTES.player(playerSlug),
    },
  };
}

export default async function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const { playerSlug } = await params;
  const player = await fetchPublicPlayer(playerSlug);
  if (!player) {
    notFound();
  }

  const [sessions, games] = await Promise.all([
    fetchPublicSessionsForPlayer(player),
    fetchPublicGamesForPlayer(player),
  ]);

  return (
    <>
      <PlayerDetailHeaderSection
        displayName={player.displayName}
        nickname={player.nickname ?? undefined}
      />
      <PlayerDetailSessionsSection sessions={toPlayerDetailSessionCards(sessions)} />
      <PlayerDetailGamesSection games={toPlayerDetailGameCards(games)} />
    </>
  );
}
