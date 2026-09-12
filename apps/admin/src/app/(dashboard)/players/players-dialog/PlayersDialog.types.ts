import type { PlayerFormSource } from "./player-form/PlayerForm.defaults";

export type PlayersDialogPlayer = PlayerFormSource & { id: string };

export type PlayersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player?: PlayersDialogPlayer | null;
};
