import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
import { publicPlayersQueryKey } from "@/hooks/use-public-players/query";
import { fetchPublicPlayers } from "@/hooks/use-public-players/server";
import { publicSessionsQueryKey } from "@/hooks/use-public-sessions/query";
import { fetchPublicSessions } from "@/hooks/use-public-sessions/server";
import { publicVenuesQueryKey } from "@/hooks/use-public-venues/query";
import { fetchPublicVenues } from "@/hooks/use-public-venues/server";
import { SessionsHeroSection } from "@/sections/sessions/hero/SessionsHeroSection";
import { SessionsIndex } from "@/sections/sessions/SessionsIndex";

export const metadata: Metadata = {
  title: PAGE_SEO.sessions.title,
  description: PAGE_SEO.sessions.description,
  openGraph: {
    title: PAGE_SEO.sessions.title,
    description: PAGE_SEO.sessions.description,
  },
};

export default async function SessionsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: publicSessionsQueryKey.all(),
      queryFn: fetchPublicSessions,
    }),
    queryClient.prefetchQuery({
      queryKey: publicPlayersQueryKey.all(),
      queryFn: fetchPublicPlayers,
    }),
    queryClient.prefetchQuery({
      queryKey: publicVenuesQueryKey.all(),
      queryFn: fetchPublicVenues,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SessionsHeroSection />
      <SessionsIndex />
    </HydrationBoundary>
  );
}
