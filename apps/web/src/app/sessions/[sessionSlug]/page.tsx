import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { formatPageTitle, PAGE_SEO } from "@/constants/seo";
import { fetchPublicSession } from "@/hooks/use-public-sessions/server";
import {
  SessionDetailGamesSection,
  toSessionDetailGameCards,
} from "@/sections/session-detail/games/SessionDetailGamesSection";
import { SessionDetailHeaderSection } from "@/sections/session-detail/header/SessionDetailHeaderSection";
import {
  SessionDetailPlayersSection,
  toSessionDetailPlayerCards,
} from "@/sections/session-detail/players/SessionDetailPlayersSection";

type SessionDetailPageProps = {
  params: Promise<{ sessionSlug: string }>;
};

export async function generateMetadata({ params }: SessionDetailPageProps): Promise<Metadata> {
  const { sessionSlug } = await params;
  const detail = await fetchPublicSession(sessionSlug);
  if (!detail) {
    return {
      title: PAGE_SEO.notFound.title,
      description: PAGE_SEO.notFound.description,
    };
  }

  const name = detail.session.title?.trim() || detail.session.sessionDate;
  const title = formatPageTitle("session", name);
  const venueName = detail.venue?.name ?? "an unnamed court";
  const description = `Games from ${detail.session.sessionDate} at ${venueName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: ROUTES.session(sessionSlug),
    },
  };
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { sessionSlug } = await params;
  const detail = await fetchPublicSession(sessionSlug);
  if (!detail) {
    notFound();
  }

  return (
    <>
      <SessionDetailHeaderSection
        sessionDate={detail.session.sessionDate}
        title={detail.session.title ?? undefined}
        venueName={detail.venue?.name ?? undefined}
        notes={detail.session.notes ?? undefined}
      />
      <SessionDetailPlayersSection players={toSessionDetailPlayerCards(detail.players)} />
      <SessionDetailGamesSection
        games={toSessionDetailGameCards(detail.session.sessionDate, detail.games)}
      />
    </>
  );
}
