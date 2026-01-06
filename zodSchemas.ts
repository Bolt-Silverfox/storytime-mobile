import z from "zod";

const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Name is required"),
    email: z.email("Invalid email, try again"),
    nationality: z.string().trim().min(1, "Nationality is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/(?=.*\d)/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .min(8, "Password should be at least 8 characters long")
      .regex(
        /(?=.*[!@#$%^&*])/,
        "Password must contain at least one special character (!@#$%^&*)"
      ),
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
