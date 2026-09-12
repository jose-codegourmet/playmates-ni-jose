import { z } from "zod";

export const addCourtFormSchema = z.object({
  name: z.string().trim().min(1, "Court name is required"),
});

export type AddCourtFormValues = z.infer<typeof addCourtFormSchema>;
