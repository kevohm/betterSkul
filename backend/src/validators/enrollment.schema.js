const { z } = require("zod");

const enrollmentSchema = z.object({
  student_id: z
    .number()
    .int()
    .positive("Student ID must be a positive integer"),
  course_id: z.number().int().positive("Course ID must be a positive integer"),
  grade: z
    .string()
    .max(2, "Grade too long")
    .regex(
      /^[A-F][+-]?$|^$/,
      "Invalid grade format (A-F with optional +/- or empty)"
    )
    .optional()
    .nullable(),
});

const updateEnrollmentSchema = enrollmentSchema
  .omit({ student_id: true, course_id: true }) // Remove ID fields for updates
  .partial();

module.exports = {
  enrollmentSchema,
  updateEnrollmentSchema,
};
