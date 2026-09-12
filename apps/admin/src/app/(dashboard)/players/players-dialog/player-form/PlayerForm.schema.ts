import { z } from "zod";

export const playerFormSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required"),
  nickname: z.string(),
  facebookName: z.string(),
  facebookUrl: z
    .string()
    .trim()
    .refine((value) => value === "" || z.string().url().safeParse(value).success, {
      message: "Enter a valid URL",
    }),
  notes: z.string(),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;
