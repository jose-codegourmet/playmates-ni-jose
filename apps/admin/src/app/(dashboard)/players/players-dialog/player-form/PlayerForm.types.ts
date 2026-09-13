import type { PlayerFormSource } from "./PlayerForm.defaults";

export type PlayerFormCreated = {
  id: string;
  displayName: string;
};

export type PlayerFormProps = {
  player?: (PlayerFormSource & { id: string }) | null;
  onSuccess?: (player: PlayerFormCreated) => void;
};
