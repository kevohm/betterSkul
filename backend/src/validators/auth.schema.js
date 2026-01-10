const { z } = require("zod");

const dateStringToMysqlDate = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  })
  .transform((val) => {
    const date = new Date(val);
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  });


const registerSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    role: z.enum(["student", "instructor"]).default("student"),
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    full_name: z.string().min(1).optional(),
    date_of_birth: dateStringToMysqlDate.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "student") {
      if (!data.first_name) {
        ctx.addIssue({
          path: ["first_name"],
          message: "First name is required for students",
        });
      }

      if (!data.last_name) {
        ctx.addIssue({
          path: ["last_name"],
          message: "Last name is required for students",
        });
      }

      if (!data.date_of_birth) {
        ctx.addIssue({
          path: ["date_of_birth"],
          message: "Date of birth is required for students",
        });
      }
    }

    if (data.role === "instructor" && !data.full_name) {
      ctx.addIssue({
        path: ["full_name"],
        message: "Full name is required for instructors",
      });
    }
  });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

module.exports = {
  registerSchema,
  loginSchema,
};
