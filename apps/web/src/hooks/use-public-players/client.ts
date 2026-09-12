"use client";

import { useQuery } from "@tanstack/react-query";
import { publicPlayersQueryKey } from "./query";
import { fetchPublicPlayers } from "./server";

/** List hook only. Player detail stays on the server (`fetchPublicPlayer`). */
export function usePublicPlayers() {
  return useQuery({
    queryKey: publicPlayersQueryKey.all(),
    queryFn: fetchPublicPlayers,
  });
}
