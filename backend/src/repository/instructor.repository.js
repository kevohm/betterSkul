const { NotFoundError } = require("../errors/http.error");
const { updateMysqlUtil } = require("../utils/update.mysql");

exports.findAll = async (connection, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;

  const [[{ total }]] = await connection.query(
    "SELECT COUNT(*) AS total FROM instructors"
  );

  const [rows] = await connection.query(
    "SELECT * FROM instructors LIMIT ? OFFSET ?",
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
  const [rows] = await connection.query(
    "SELECT * FROM instructors WHERE id = ?",
    [id]
  );
  return rows[0];
};

exports.findByIdSecurely = async (connection, id) => {
  const instructor = await this.findById(connection, id);
  if (!instructor) {
    throw new NotFoundError("Instructor not found");
  }
  return instructor;
};

exports.findByUserId = async (connection, userId) => {
  const [rows] = await connection.query(
    "SELECT * FROM instructors WHERE user_id = ?",
    [userId]
  );
  return rows[0];
};

exports.create = async (connection, { user_id, full_name }) => {
  const [result] = await connection.query(
    "INSERT INTO instructors (user_id, full_name) VALUES (?, ?)",
    [user_id, full_name]
  );
  return result.insertId;
};

exports.update = async (connection, id, { user_id, full_name }) => {
  return await updateMysqlUtil(connection, "instructors", id, {
    user_id,
    full_name,
  });
};

exports.remove = async (connection, id) => {
  const [result] = await connection.query(
    "DELETE FROM instructors WHERE id = ?",
    [id]
  );
  return result.affectedRows;
};
