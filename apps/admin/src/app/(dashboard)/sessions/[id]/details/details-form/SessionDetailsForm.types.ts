import type {
  SessionFormCourtOption,
  SessionFormVenueOption,
} from "@/modules/playmates/session-form/SessionForm.types";

import type { SessionDetailsFormValues } from "./SessionDetailsForm.schema";

export type SessionDetailsFormProps = {
  sessionId: string;
  slug: string | null;
  venues: SessionFormVenueOption[];
  courts: SessionFormCourtOption[];
  defaultValues?: Partial<SessionDetailsFormValues>;
};
