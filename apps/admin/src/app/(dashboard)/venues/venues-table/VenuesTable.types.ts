import type { Venue } from "@fe-template/mocks";

export type VenueRow = Venue & {
  courtCount: number;
};

export type VenuesTableProps = {
  venues: VenueRow[];
};
