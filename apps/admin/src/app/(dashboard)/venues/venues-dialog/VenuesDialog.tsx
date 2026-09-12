"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@fe-template/ui";
import type { VenuesDialogProps } from "./VenuesDialog.types";
import { VenueForm } from "./venue-form/VenueForm";

function VenuesDialog({ open, onOpenChange, venue }: VenuesDialogProps) {
  const isEdit = Boolean(venue);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit venue" : "Add venue"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this venue's name, address, and notes."
              : "Name is required. Address and notes are optional."}
          </DialogDescription>
        </DialogHeader>
        <VenueForm
          key={venue?.id ?? "create"}
          venue={venue}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export type { VenuesDialogProps };
export { VenuesDialog };
