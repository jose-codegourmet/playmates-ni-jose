import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { PAGE_SEO } from "@/constants/seo";
import { fetchPublicSessions } from "@/hooks/use-public-sessions/server";
import { fetchPublicVenues } from "@/hooks/use-public-venues/server";
import { toVenueCards, VenuesGridSection } from "@/sections/venues/grid/VenuesGridSection";
import { VenuesHeroSection } from "@/sections/venues/hero/VenuesHeroSection";

export const metadata: Metadata = {
  title: PAGE_SEO.venues.title,
  description: PAGE_SEO.venues.description,
  openGraph: {
    title: PAGE_SEO.venues.title,
    description: PAGE_SEO.venues.description,
    url: ROUTES.venues,
  },
};

export default async function VenuesPage() {
  const [venues, sessions] = await Promise.all([fetchPublicVenues(), fetchPublicSessions()]);

  return (
    <>
      <VenuesHeroSection />
      <VenuesGridSection venues={toVenueCards(venues, sessions)} />
    </>
  );
}
