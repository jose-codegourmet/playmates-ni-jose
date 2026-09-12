"use client";

import { useState } from "react";
import { usePublicPlayers } from "@/hooks/use-public-players/client";
import { usePublicSessions } from "@/hooks/use-public-sessions/client";
import type { PublicSessionFilters } from "@/hooks/use-public-sessions/types";
import { usePublicVenues } from "@/hooks/use-public-venues/client";
import { SessionsFiltersSection } from "@/sections/sessions/filters/SessionsFiltersSection";
import { SessionsGridSection, toSessionCards } from "@/sections/sessions/grid/SessionsGridSection";

function SessionsIndex() {
  const [filters, setFilters] = useState<PublicSessionFilters>({});
  const sessionsQuery = usePublicSessions(filters);
  const playersQuery = usePublicPlayers();
  const venuesQuery = usePublicVenues();

  return (
    <>
      <SessionsFiltersSection
        players={playersQuery.data ?? []}
        venues={venuesQuery.data ?? []}
        value={filters}
        onChange={setFilters}
      />
      <SessionsGridSection sessions={toSessionCards(sessionsQuery.data ?? [])} />
    </>
  );
}

export { SessionsIndex };
