import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(
      /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
