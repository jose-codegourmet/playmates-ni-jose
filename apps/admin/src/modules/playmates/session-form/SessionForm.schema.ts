import { z } from "zod";

export const sessionFormSchema = z.object({
  sessionDate: z
    .string()
    .trim()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
  title: z.string(),
  venueId: z.string(),
  courtId: z.string(),
  notes: z.string(),
  playerIds: z.array(z.string()),
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;
