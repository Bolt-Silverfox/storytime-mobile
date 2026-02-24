import z from "zod";

const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Name is required"),
    email: z.email("Invalid email, try again"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character (!@#$%^&*)")
      .regex(
        /(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/(?=.*\d)/, "Password must contain at least one number")
      .regex(
        /(?=.*[!@#$%^&*])/,
        "Password must contain at least one special character (!@#$%^&*)"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.fullName.split(" ").length >= 2, {
    path: ["fullName"],
    message: "Full name must contain at least two parts",
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Both password fields must match",
  });

export { registerSchema };
