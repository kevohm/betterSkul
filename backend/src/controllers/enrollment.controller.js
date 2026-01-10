const { pool } = require("../../db");
const { NotFoundError, BadRequestError } = require("../errors/http.error");
const enrollmentRepo = require("../repository/enrollment.repository");
const { validate } = require("../utils/validate");
const withTransaction = require("../utils/withTransaction");
const { paginationSchema } = require("../validators/base.schema");
const { updateEnrollmentSchema } = require("../validators/enrollment.schema");

// READ operations (no transaction needed)

exports.getEnrollments = async (req, res) => {
  const { page, pageSize } = paginationSchema.parse(req.query);
  const enrollments = await enrollmentRepo.findAll(pool, page, pageSize);
  res.json(enrollments);
};

exports.getEnrollmentById = async (req, res) => {
  const { student_id, course_id } = req.params;
  const enrollment = await enrollmentRepo.findByIdSecurely(
    pool,
    student_id,
    course_id
  );
  res.status(200).json(enrollment);
};

// WRITE operations (use transactions)
exports.createEnrollment = async (req, res) => {
  const result = await withTransaction(async (connection) => {
    return await enrollmentRepo.create(connection, req.body);
  });

  res.status(201).json({ ...req.body });
};

exports.updateEnrollment = async (req, res) => {
  const data = await validate(updateEnrollmentSchema, req.body);
  const { student_id, course_id } = req.params;
  await enrollmentRepo.findByIdSecurely(pool, student_id, course_id);

  const updated = await withTransaction(async (connection) => {
    return await enrollmentRepo.update(connection, student_id, course_id, data);
  });

  if (!updated) {
    throw new BadRequestError("Oops! An error occurred");
  }

  res.status(200).json({ student_id, course_id, ...req.body });
};

exports.deleteEnrollment = async (req, res) => {
  const { student_id, course_id } = req.params;
  await enrollmentRepo.findByIdSecurely(pool, student_id, course_id);
  const deleted = await withTransaction(async (connection) => {
    return await enrollmentRepo.remove(connection, student_id, course_id);
  });

  if (!deleted) {
    throw new BadRequestError("Oops! An error occurred");
  }
  res.status(204).json({ message: "Enrollment deleted" });
};
