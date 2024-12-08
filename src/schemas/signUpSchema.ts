import {z} from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must be at most 20 characters long")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Please enter your email address"}),
    password: z.string().min(8, "Password must be at least 8 characters long").max(64, "Password must be at most 64 characters long").regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    // verifyCode: z.string().min(6, "Verify code must be at least 6 characters long").max(6, "Verify code must be at most 6 characters long"),
    // verifyCodeExpiry: z.date(),
})
