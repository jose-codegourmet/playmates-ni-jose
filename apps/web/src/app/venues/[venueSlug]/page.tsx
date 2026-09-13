import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { formatPageTitle, PAGE_SEO } from "@/constants/seo";
import { fetchPublicSessionsForVenue } from "@/hooks/use-public-sessions/server";
import { fetchPublicVenue } from "@/hooks/use-public-venues/server";
import { VenueDetailHeaderSection } from "@/sections/venue-detail/header/VenueDetailHeaderSection";
import {
  toVenueDetailSessionCards,
  VenueDetailSessionHistorySection,
} from "@/sections/venue-detail/session-history/VenueDetailSessionHistorySection";

type VenueDetailPageProps = {
  params: Promise<{ venueSlug: string }>;
};

async function loadVenueDetail(venueSlug: string) {
  const venue = await fetchPublicVenue(venueSlug);
  if (!venue) {
    return null;
  }

  const sessions = await fetchPublicSessionsForVenue(venue);
  const history = toVenueDetailSessionCards(venue, sessions);
  if (history.length === 0) {
    return null;
  }

  return { venue, history };
}

export async function generateMetadata({ params }: VenueDetailPageProps): Promise<Metadata> {
  const { venueSlug } = await params;
  const detail = await loadVenueDetail(venueSlug);
  if (!detail) {
    return {
      title: PAGE_SEO.notFound.title,
      description: PAGE_SEO.notFound.description,
    };
  }

  const title = formatPageTitle("venue", detail.venue.name);
  const address = detail.venue.address?.trim();
  const description = address
    ? `Sessions recorded at ${detail.venue.name} in ${address}.`
    : PAGE_SEO.venue.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: ROUTES.venue(venueSlug),
    },
  };
}

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { venueSlug } = await params;
  const detail = await loadVenueDetail(venueSlug);
  if (!detail) {
    notFound();
  }

  return (
    <>
      <VenueDetailHeaderSection
        name={detail.venue.name}
        address={detail.venue.address ?? undefined}
        notes={detail.venue.notes ?? undefined}
      />
      <VenueDetailSessionHistorySection sessions={detail.history} />
    </>
  );
}
