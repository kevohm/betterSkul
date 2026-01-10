const { z } = require("zod");

const studentSchema = z.object({
  user_id: z.number().int().positive("User ID must be a positive integer"),
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .transform((val) => {
      const date = new Date(val);
      return date.toISOString().slice(0, 10); // YYYY-MM-DD
    })
    .refine((date) => {
      const dob = new Date(date);
      const today = new Date();
      return dob < today;
    }, "Date of birth must be in the past"),
});

const updateStudentSchema = studentSchema.partial();

module.exports = {
  studentSchema,
  updateStudentSchema,
};