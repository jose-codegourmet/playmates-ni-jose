import type { GameWithTeamsAndRecordings } from "@fe-template/mocks";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { formatPageTitle, PAGE_SEO } from "@/constants/seo";
import { fetchPublicGamePage } from "@/hooks/use-public-games/server";
import { GameDetailHeaderSection } from "@/sections/game-detail/header/GameDetailHeaderSection";
import {
  GameDetailLinksSection,
  toGameDetailProviderLinks,
} from "@/sections/game-detail/links/GameDetailLinksSection";
import { GameDetailPagerSection } from "@/sections/game-detail/pager/GameDetailPagerSection";
import {
  GameDetailRecordingsSection,
  toGameDetailRecordingGroups,
} from "@/sections/game-detail/recordings/GameDetailRecordingsSection";

type GameDetailPageProps = {
  params: Promise<{ gameSlug: string }>;
};

function teamNames(game: GameWithTeamsAndRecordings, teamNo: number): string[] {
  return (
    game.teams
      .find((team) => team.teamNo === teamNo)
      ?.players.map((player) => player.displayName) ?? []
  );
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const { gameSlug } = await params;
  const page = await fetchPublicGamePage(gameSlug);
  if (!page || page.game.gameNumber == null) {
    return {
      title: PAGE_SEO.notFound.title,
      description: PAGE_SEO.notFound.description,
    };
  }

  const title = formatPageTitle("game", `Game ${page.game.gameNumber}`);
  const venueName = page.venueName ?? "an unnamed court";
  const description = `Game ${page.game.gameNumber} from ${page.sessionDate} at ${venueName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: ROUTES.game(gameSlug),
    },
  };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { gameSlug } = await params;
  const page = await fetchPublicGamePage(gameSlug);
  if (!page || page.game.gameNumber == null) {
    notFound();
  }

  const team1 = teamNames(page.game, 1);
  const team2 = teamNames(page.game, 2);

  return (
    <>
      <GameDetailHeaderSection
        gameNumber={page.game.gameNumber}
        team1={team1}
        team2={team2}
        sessionDate={page.sessionDate}
        sessionHref={ROUTES.session(page.sessionSlug)}
        sessionTitle={page.sessionTitle ?? undefined}
        venueName={page.venueName ?? undefined}
      />
      <GameDetailRecordingsSection
        groups={toGameDetailRecordingGroups(page.game.recordings, page.assets)}
      />
      <GameDetailLinksSection assets={toGameDetailProviderLinks(page.assets)} />
      <GameDetailPagerSection
        previous={
          page.previous
            ? { href: ROUTES.game(page.previous.slug), gameNumber: page.previous.gameNumber }
            : undefined
        }
        next={
          page.next
            ? { href: ROUTES.game(page.next.slug), gameNumber: page.next.gameNumber }
            : undefined
        }
      />
    </>
  );
}
