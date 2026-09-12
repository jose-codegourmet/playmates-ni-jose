"use client";

import { useQuery } from "@tanstack/react-query";
import { publicGamesQueryKey } from "./query";
import { fetchPublicGames } from "./server";

/** List hook only. Game detail stays on the server (`fetchPublicGame`). */
export function usePublicGames() {
  return useQuery({
    queryKey: publicGamesQueryKey.all(),
    queryFn: fetchPublicGames,
  });
}
