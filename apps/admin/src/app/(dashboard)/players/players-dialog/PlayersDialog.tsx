"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@fe-template/ui";
import type { PlayersDialogProps } from "./PlayersDialog.types";
import { PlayerForm } from "./player-form/PlayerForm";

function PlayersDialog({ open, onOpenChange, player, onCreated }: PlayersDialogProps) {
  const isEdit = Boolean(player);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit player" : "Add player"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this player's display name and optional Facebook details."
              : "Display name is required. Nickname and Facebook fields are optional."}
          </DialogDescription>
        </DialogHeader>
        <PlayerForm
          key={player?.id ?? "create"}
          player={player}
          onSuccess={(created) => {
            if (!player) onCreated?.(created);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export type { PlayersDialogProps };
export { PlayersDialog };
