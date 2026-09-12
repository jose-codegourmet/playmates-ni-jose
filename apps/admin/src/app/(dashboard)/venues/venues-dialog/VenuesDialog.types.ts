import type { VenueFormSource } from "./venue-form/VenueForm.defaults";

export type VenuesDialogVenue = VenueFormSource & { id: string };

export type VenuesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue?: VenuesDialogVenue | null;
};
