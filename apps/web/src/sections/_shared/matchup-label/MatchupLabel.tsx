import { formatMatchup } from "@fe-template/mocks";

import type { MatchupLabelProps } from "./MatchupLabel.types";

export function formatMatchupLabel(team1: string[], team2: string[]): string {
  return formatMatchup(team1, team2);
}

function MatchupLabel({ team1, team2 }: MatchupLabelProps) {
  return <p className="text-sm text-foreground">{formatMatchupLabel(team1, team2)}</p>;
}

export type { MatchupLabelProps };
export { MatchupLabel };
