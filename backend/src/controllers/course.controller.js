const { pool } = require("../../db");
const { NotFoundError, BadRequestError } = require("../errors/http.error");
const courseRepo = require("../repository/course.repository");
const { validate } = require("../utils/validate");
const withTransaction = require("../utils/withTransaction");
const { paginationSchema } = require("../validators/base.schema");
const { updateCourseSchema } = require("../validators/course.schema");

// READ operations (no transaction needed)

exports.getCourses = async (req, res) => {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const courses = await courseRepo.findAll(pool, page, pageSize);
    res.json(courses);
};

exports.getCourseById = async (req, res) => {
  const course = await courseRepo.findByIdSecurely(pool, req.params.id);
  res.status(200).json(course);
};

// WRITE operations (use transactions)
exports.createCourse = async (req, res) => {
  const id = await withTransaction(async (connection) => {
    return await courseRepo.create(connection, req.body);
  });

  res.status(201).json({ id, ...req.body });
};

exports.updateCourse = async (req, res) => {
  const data = await validate(updateCourseSchema, req.body);
  const id = req.params.id;
  await courseRepo.findByIdSecurely(pool, id);

  const updated = await withTransaction(async (connection) => {
    return await courseRepo.update(connection, id, data);
  });

  if (!updated) {
    throw new BadRequestError("Oops! An error occurred");
  }

  res.status(200).json({ id: req.params.id, ...req.body });
};

exports.deleteCourse = async (req, res) => {
  const id = req.params.id;
  await courseRepo.findByIdSecurely(pool, id);
  const deleted = await withTransaction(async (connection) => {
    return await courseRepo.remove(connection, id);
  });

  if (!deleted) {
    throw new BadRequestError("Oops! An error occurred");
  }
  res.status(204).json({ message: "Course deleted" });
};