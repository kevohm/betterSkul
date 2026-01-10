const { updateMysqlUtil } = require("../utils/update.mysql");

exports.findAll = async (connection, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;

  // Get total rows count
  const [[{ total }]] = await connection.query(
    "SELECT COUNT(*) AS total FROM students"
  );

  // Get paginated rows
  const [rows] = await connection.query(
    "SELECT * FROM students LIMIT ? OFFSET ?",
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
  const [rows] = await connection.query("SELECT * FROM students WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

exports.findByIdSecurely = async (connection, id) => {
  const student = await this.findById(connection, id);
  if (!student) {
    throw new NotFoundError("Student not found");
  }
  return student;
};

exports.create = async (connection, { name, email, enrollment_year }) => {
  const [result] = await connection.query(
    "INSERT INTO students (name, email, enrollment_year) VALUES (?, ?, ?)",
    [name, email, enrollment_year]
  );
  return result.insertId;
};

exports.update = async (connection, id, { name, email, enrollment_year }) => {
  return await updateMysqlUtil(connection, "students", id, {
    name,
    email,
    enrollment_year,
  });
};

exports.remove = async (connection, id) => {
  const [result] = await connection.query("DELETE FROM students WHERE id = ?", [
    id,
  ]);
  return result.affectedRows;
};
