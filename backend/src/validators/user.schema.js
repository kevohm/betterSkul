const { z } = require("zod");

const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "instructor", "admin"], {
    errorMap: () => ({ message: "Role must be student, instructor, or admin" }),
  }),
  is_active: z.boolean().optional().default(true),
});

const updateUserSchema = userSchema.partial();

module.exports = {
  userSchema,
  updateUserSchema,
};
