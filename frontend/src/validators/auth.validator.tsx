import { z } from "zod";

const dateStringToMysqlDate = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  })
  .transform((val) => {
    const date = new Date(val);
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  });

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["student", "instructor"]),
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    fullName: z.string().min(1, "Full name is required").optional(),
    dateOfBirth: dateStringToMysqlDate.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "student") {
      if (!data.firstName) {
        ctx.addIssue({
          path: ["firstName"],
          message: "First name is required for students",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.lastName) {
        ctx.addIssue({
          path: ["lastName"],
          message: "Last name is required for students",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.dateOfBirth) {
        ctx.addIssue({
          path: ["dateOfBirth"],
          message: "Date of birth is required for students",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.role === "instructor" && !data.fullName) {
      ctx.addIssue({
        path: ["fullName"],
        message: "Full name is required for instructors",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
