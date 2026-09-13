import { notFound } from "next/navigation";

import { getPlaymatesRepos } from "@/lib/playmates";
import { SessionMatchups } from "@/modules/playmates/session-matchups/SessionMatchups";
import type { SessionMatchupsWinner } from "@/modules/playmates/session-matchups/SessionMatchups.types";

type SessionMatchupsPageProps = {
  params: Promise<{ id: string }>;
};

function winnerTeamNo(value: number | null): SessionMatchupsWinner {
  return value === 1 || value === 2 ? value : null;
}

export default async function SessionMatchupsPage({ params }: SessionMatchupsPageProps) {
  const { id } = await params;
  const repos = getPlaymatesRepos();
  const detail = await repos.sessions.getById(id);
  if (!detail) notFound();

  const roster = detail.players.map((player) => ({
    id: player.id,
    displayName: player.displayName,
  }));

  const games = detail.games.map((game) => {
    const team1 =
      game.teams.find((team) => team.teamNo === 1)?.players.map((player) => player.id) ?? [];
    const team2 =
      game.teams.find((team) => team.teamNo === 2)?.players.map((player) => player.id) ?? [];
    return {
      id: game.id,
      gameNumber: game.gameNumber,
      sortOrder: game.sortOrder,
      team1,
      team2,
      winnerTeamNo: winnerTeamNo(game.winnerTeamNo),
    };
  });

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium">Matchups</h2>
        <p className="text-sm text-muted-foreground">
          Set Team 1 and Team 2 from the session roster. Copy a previous matchup when the next game
          is the same pairing.
        </p>
      </div>
      <SessionMatchups sessionId={detail.session.id} roster={roster} games={games} />
    </section>
  );
}
