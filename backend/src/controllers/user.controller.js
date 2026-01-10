const { pool } = require("../../db");
const { NotFoundError, BadRequestError } = require("../errors/http.error");
const userRepo = require("../repository/user.repository");
const { validate } = require("../utils/validate");
const withTransaction = require("../utils/withTransaction");
const { paginationSchema } = require("../validators/base.schema");
const { updateUserSchema } = require("../validators/user.schema");

// READ operations (no transaction needed)

exports.getUsers = async (req, res) => {
  // Validate query params
  const { page, pageSize } = paginationSchema.parse(req.query);

  // Fetch paginated users
  const users = await userRepo.findAll(pool, page, pageSize);

  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await userRepo.findByIdSecurely(pool, req.params.id);
  res.status(200).json(user);
};

// WRITE operations (use transactions)
exports.createUser = async (req, res) => {
  const id = await withTransaction(async (connection) => {
    return await userRepo.create(connection, req.body);
  });

  res.status(201).json({ id, ...req.body });
};

exports.updateUser = async (req, res) => {
  const data = await validate(updateUserSchema, req.body);
  const id = req.params.id;
  await userRepo.findByIdSecurely(pool, id);

  const updated = await withTransaction(async (connection) => {
    return await userRepo.update(connection, id, data);
  });

  if (!updated) {
    throw new BadRequestError("Oops! An error occurred");
  }

  res.status(200).json({ id: req.params.id, ...req.body });
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  await userRepo.findByIdSecurely(pool, id);
  const deleted = await withTransaction(async (connection) => {
    return await userRepo.remove(connection, id);
  });

  if (!deleted) {
    throw new BadRequestError("Oops! An error occurred");
  }
  res.status(204).json({ message: "User deleted" });
};
