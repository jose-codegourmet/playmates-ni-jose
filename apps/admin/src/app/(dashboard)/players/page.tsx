import { getPlaymatesRepos } from "@/lib/playmates";

import { PlayersTable } from "./players-table/PlayersTable";
import type { PlayerRow } from "./players-table/PlayersTable.types";

async function loadPlayerRows(): Promise<PlayerRow[]> {
  const repos = getPlaymatesRepos();
  const [players, sessions] = await Promise.all([
    repos.players.list({ includeArchived: true }),
    repos.sessions.list(),
  ]);

  const gameIdsByPlayer = new Map<string, Set<string>>();

  for (const item of sessions) {
    if (!item.slug) continue;
    const detail = await repos.sessions.getBySlug(item.slug);
    if (!detail) continue;

    for (const game of detail.games) {
      for (const team of game.teams) {
        for (const player of team.players) {
          const set = gameIdsByPlayer.get(player.id) ?? new Set<string>();
          set.add(game.id);
          gameIdsByPlayer.set(player.id, set);
        }
      }
    }
  }

  return players.map((player) => ({
    ...player,
    gamesCount: gameIdsByPlayer.get(player.id)?.size ?? 0,
  }));
}

export default async function PlayersPage() {
  const players = await loadPlayerRows();
  return <PlayersTable players={players} />;
}
