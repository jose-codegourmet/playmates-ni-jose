import { z } from "zod";

export const venueFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  address: z.string(),
  notes: z.string(),
});

export type VenueFormValues = z.infer<typeof venueFormSchema>;
