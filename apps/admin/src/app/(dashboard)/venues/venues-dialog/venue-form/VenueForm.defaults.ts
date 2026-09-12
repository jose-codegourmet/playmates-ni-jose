import type { VenueFormValues } from "./VenueForm.schema";

export type VenueFormSource = {
  name: string;
  address: string | null;
  notes: string | null;
};

export const venueFormDefaultValues: VenueFormValues = {
  name: "",
  address: "",
  notes: "",
};

export function getVenueFormDefaultValues(venue?: VenueFormSource | null): VenueFormValues {
  if (!venue) return venueFormDefaultValues;

  return {
    name: venue.name,
    address: venue.address ?? "",
    notes: venue.notes ?? "",
  };
}
