import type { Player } from "@fe-template/mocks";

export type PlayerRow = Player & {
  gamesCount: number;
};

export type PlayersTableProps = {
  players: PlayerRow[];
};
