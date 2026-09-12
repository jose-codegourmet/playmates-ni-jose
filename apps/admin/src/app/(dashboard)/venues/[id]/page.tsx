import { notFound } from "next/navigation";

import { getPlaymatesRepos } from "@/lib/playmates";

import { VenueCourts } from "./venue-courts/VenueCourts";

type VenueDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { id } = await params;
  const repos = getPlaymatesRepos();
  const venue = await repos.venues.getById(id);
  if (!venue) notFound();

  const courts = await repos.venues.listCourts(id, { includeArchived: true });

  return <VenueCourts venue={venue} courts={courts} />;
}
