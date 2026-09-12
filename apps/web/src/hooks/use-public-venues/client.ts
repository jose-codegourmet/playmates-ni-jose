"use client";

import { useQuery } from "@tanstack/react-query";
import { publicVenuesQueryKey } from "./query";
import { fetchPublicVenues } from "./server";

/** List hook only. Venue detail stays on the server (`fetchPublicVenue`). */
export function usePublicVenues() {
  return useQuery({
    queryKey: publicVenuesQueryKey.all(),
    queryFn: fetchPublicVenues,
  });
}
