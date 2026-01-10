const { z } = require("zod");

const instructorSchema = z.object({
  user_id: z.number().int().positive("User ID must be a positive integer"),
  full_name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name too long"),
});

const updateInstructorSchema = instructorSchema.partial();

module.exports = {
  instructorSchema,
  updateInstructorSchema,
};
