const { pool } = require("../../db");
const { NotFoundError, BadRequestError } = require("../errors/http.error");
const instructorRepo = require("../repository/instructor.repository");
const { validate } = require("../utils/validate");
const withTransaction = require("../utils/withTransaction");
const { paginationSchema } = require("../validators/base.schema");
const { updateInstructorSchema } = require("../validators/instructor.schema");

// READ operations (no transaction needed)

exports.getInstructors = async (req, res) => {
  const { page, pageSize } = paginationSchema.parse(req.query);
  const instructors = await instructorRepo.findAll(pool, page, pageSize);
  res.json(instructors);
};

exports.getInstructorById = async (req, res) => {
  const instructor = await instructorRepo.findByIdSecurely(pool, req.params.id);
  res.status(200).json(instructor);
};

// WRITE operations (use transactions)
exports.createInstructor = async (req, res) => {
  const id = await withTransaction(async (connection) => {
    return await instructorRepo.create(connection, req.body);
  });

  res.status(201).json({ id, ...req.body });
};

exports.updateInstructor = async (req, res) => {
  const data = await validate(updateInstructorSchema, req.body);
  const id = req.params.id;
  await instructorRepo.findByIdSecurely(pool, id);

  const updated = await withTransaction(async (connection) => {
    return await instructorRepo.update(connection, id, data);
  });

  if (!updated) {
    throw new BadRequestError("Oops! An error occurred");
  }

  res.status(200).json({ id: req.params.id, ...req.body });
};

exports.deleteInstructor = async (req, res) => {
  const id = req.params.id;
  await instructorRepo.findByIdSecurely(pool, id);
  const deleted = await withTransaction(async (connection) => {
    return await instructorRepo.remove(connection, id);
  });

  if (!deleted) {
    throw new BadRequestError("Oops! An error occurred");
  }
  res.status(204).json({ message: "Instructor deleted" });
};
