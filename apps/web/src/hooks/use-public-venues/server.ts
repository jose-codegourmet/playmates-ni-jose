"use server";

import { getPublicVenue, listPublicVenues } from "@/lib/playmates";
import type { Venue } from "./types";

export async function fetchPublicVenues(): Promise<Venue[]> {
  return listPublicVenues();
}

/** Returns `null` for missing or archived slugs. Do not prefetch private slugs for SEO. */
export async function fetchPublicVenue(slug: string): Promise<Venue | null> {
  return getPublicVenue(slug);
}
