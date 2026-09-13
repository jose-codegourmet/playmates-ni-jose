import type { GameTeamRosterPlayer } from "../game-team-editor/GameTeamEditor.types";

export type SessionMatchupsRosterPlayer = GameTeamRosterPlayer;

export type SessionMatchupsWinner = 1 | 2 | null;

export type SessionMatchupsGame = {
  id: string;
  gameNumber: number | null;
  sortOrder: number;
  team1: string[];
  team2: string[];
  winnerTeamNo: SessionMatchupsWinner;
};

export type SessionMatchupsTeamsValue = {
  team1: string[];
  team2: string[];
};

export type SessionMatchupsProps = {
  sessionId: string;
  roster: SessionMatchupsRosterPlayer[];
  games: SessionMatchupsGame[];
  onSetTeams?: (gameId: string, next: SessionMatchupsTeamsValue) => void | Promise<void>;
  onSetWinner?: (gameId: string, winnerTeamNo: SessionMatchupsWinner) => void | Promise<void>;
};
