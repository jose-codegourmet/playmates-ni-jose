import type { SessionFormValues } from "./SessionForm.schema";

export type SessionFormVenueOption = {
  id: string;
  name: string;
};

export type SessionFormCourtOption = {
  id: string;
  name: string;
  venueId: string;
};

export type SessionFormPlayerOption = {
  id: string;
  displayName: string;
};

export type SessionFormProps = {
  venues: SessionFormVenueOption[];
  courts: SessionFormCourtOption[];
  players: SessionFormPlayerOption[];
  defaultValues?: Partial<SessionFormValues>;
};
