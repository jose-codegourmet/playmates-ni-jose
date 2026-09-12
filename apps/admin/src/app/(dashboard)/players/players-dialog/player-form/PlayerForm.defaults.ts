import type { PlayerFormValues } from "./PlayerForm.schema";

export type PlayerFormSource = {
  displayName: string;
  nickname: string | null;
  facebookName: string | null;
  facebookUrl: string | null;
  notes: string | null;
};

export const playerFormDefaultValues: PlayerFormValues = {
  displayName: "",
  nickname: "",
  facebookName: "",
  facebookUrl: "",
  notes: "",
};

export function getPlayerFormDefaultValues(player?: PlayerFormSource | null): PlayerFormValues {
  if (!player) return playerFormDefaultValues;

  return {
    displayName: player.displayName,
    nickname: player.nickname ?? "",
    facebookName: player.facebookName ?? "",
    facebookUrl: player.facebookUrl ?? "",
    notes: player.notes ?? "",
  };
}
