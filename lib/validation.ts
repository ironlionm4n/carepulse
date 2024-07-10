import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Username is too short - 2 characters min")
    .max(50, "Username is too long - 50 characters max"),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+?[1-9]\d{1,14}$/.test(phone),
      "Please enter a valid phone number"
    ),
});
