import type { VenueFormSource } from "./VenueForm.defaults";

export type VenueFormProps = {
  venue?: (VenueFormSource & { id: string }) | null;
  onSuccess?: () => void;
};
