import type { PlayerFormSource } from "./player-form/PlayerForm.defaults";

export type PlayersDialogPlayer = PlayerFormSource & { id: string };

export type PlayersDialogCreated = {
  id: string;
  displayName: string;
};

export type PlayersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player?: PlayersDialogPlayer | null;
  onCreated?: (player: PlayersDialogCreated) => void;
};
