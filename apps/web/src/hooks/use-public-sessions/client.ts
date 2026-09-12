"use client";

import { useQuery } from "@tanstack/react-query";
import { publicSessionsQueryKey } from "./query";
import { fetchPublicSessions } from "./server";
import { filterPublicSessions, type PublicSessionFilters } from "./types";

export function usePublicSessions(filters?: PublicSessionFilters) {
  return useQuery({
    queryKey: publicSessionsQueryKey.all(),
    queryFn: fetchPublicSessions,
    select: (sessions) => filterPublicSessions(sessions, filters),
  });
}
