const { NotFoundError } = require("../errors/http.error");
const { updateMysqlUtil } = require("../utils/update.mysql");

exports.findAll = async (connection, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;

  // Get total rows count
  const [[{ total }]] = await connection.query(
    "SELECT COUNT(*) AS total FROM users"
  );

  // Get paginated rows
  const [rows] = await connection.query(
    "SELECT * FROM users LIMIT ? OFFSET ?",
    [pageSize, offset]
  );

  return {
    data: rows,
    total,
    page,
    pageSize,
  };
};

exports.findById = async (connection, id) => {
  const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

exports.findByIdSecurely = async (connection, id) => {
  const user = await this.findById(connection, id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

exports.findByEmail = async (connection, email) => {
  const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

exports.create = async (
  connection,
  { email, password, role, is_active = true }
) => {
  const [result] = await connection.query(
    "INSERT INTO users (email, password, role, is_active) VALUES (?, ?, ?, ?)",
    [email, password, role, is_active]
  );
  return result.insertId;
};

exports.update = async (
  connection,
  id,
  { email, password, role, is_active }
) => {
  return await updateMysqlUtil(connection, "users", id, {
    email,
    password,
    role,
    is_active,
  });
};

exports.remove = async (connection, id) => {
  const [result] = await connection.query("DELETE FROM users WHERE id = ?", [
    id,
  ]);
  return result.affectedRows;
};
