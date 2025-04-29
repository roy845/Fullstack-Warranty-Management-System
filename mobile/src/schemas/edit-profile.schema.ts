import { z } from "zod";

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  email: z.string().email("Invalid email").min(5).max(100).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d|.*\W)/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number or special character",
    })
    .optional()
    .or(z.literal("")),
  bio: z
    .object({
      welcomeMessage: z.string().optional(),
      avatar: z.string().optional(),
    })
    .optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
