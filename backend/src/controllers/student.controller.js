const { pool } = require("../../db");
const { NotFoundError, BadRequestError } = require("../errors/http.error");
const studentRepo = require("../repository/student.repository");
const { validate } = require("../utils/validate");
const withTransaction = require("../utils/withTransaction");
const { paginationSchema } = require("../validators/base.schema");
const { updateStudentSchema } = require("../validators/student.schema");

// READ operations (no transaction needed)

exports.getStudents = async (req, res) => {
    // Validate query params
    const { page, pageSize } = paginationSchema.parse(req.query);

    // Fetch paginated students
    const students = await studentRepo.findAll(pool, page, pageSize);

    res.json(students);
};


exports.getStudentById = async (req, res) => {
  const student = await studentRepo.findByIdSecurely(pool, req.params.id);
  res.status(200).json(student);
};

// WRITE operations (use transactions)
exports.createStudent = async (req, res) => {
  const id = await withTransaction(async (connection) => {
    return await studentRepo.create(connection, req.body);
  });

  res.status(201).json({ id, ...req.body });
};

exports.updateStudent = async (req, res) => {
  const data = await validate(updateStudentSchema, req.body);
  const id = req.params.id;
  await studentRepo.findByIdSecurely(id);

  const updated = await withTransaction(async (connection) => {
    return await studentRepo.update(connection, id, data);
  });

  if (!updated) {
    throw new BadRequestError("Oops! An error occurred");
  }

  res.status(200).json({ id: req.params.id, ...req.body });
};

exports.deleteStudent = async (req, res) => {
  const id = req.params.id;
  await studentRepo.findByIdSecurely(pool, id);
  const deleted = await withTransaction(async (connection) => {
    return await studentRepo.remove(connection, id);
  });

  if (!deleted) {
    throw new BadRequestError("Oops! An error occurred");
  }
  res.status(204).json({ message: "Student deleted" });
};
