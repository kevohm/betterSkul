const { z } = require("zod");

const courseSchema = z.object({
  course_code: z
    .string()
    .min(1, "Course code is required")
    .max(20, "Course code too long")
    .regex(
      /^[A-Z0-9-]+$/,
      "Course code can only contain uppercase letters, numbers, and hyphens"
    ),
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  instructor_id: z
    .number()
    .int()
    .positive("Instructor ID must be a positive integer"),
});

const updateCourseSchema = courseSchema.partial();

module.exports = {
  courseSchema,
  updateCourseSchema,
};
