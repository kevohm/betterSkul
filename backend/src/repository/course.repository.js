const { NotFoundError } = require("../errors/http.error");
const { updateMysqlUtil } = require("../utils/update.mysql");

exports.findAll = async (connection, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;

  const [[{ total }]] = await connection.query(
    "SELECT COUNT(*) AS total FROM courses"
  );

  const [rows] = await connection.query(
    "SELECT * FROM courses LIMIT ? OFFSET ?",
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
  const [rows] = await connection.query("SELECT * FROM courses WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

exports.findByIdSecurely = async (connection, id) => {
  const course = await this.findById(connection, id);
  if (!course) {
    throw new NotFoundError("Course not found");
  }
  return course;
};

exports.findByCourseCode = async (connection, courseCode) => {
  const [rows] = await connection.query(
    "SELECT * FROM courses WHERE course_code = ?",
    [courseCode]
  );
  return rows[0];
};

exports.findByInstructorId = async (connection, instructorId) => {
  const [rows] = await connection.query(
    "SELECT * FROM courses WHERE instructor_id = ?",
    [instructorId]
  );
  return rows;
};

exports.create = async (connection, { course_code, title, instructor_id }) => {
  const [result] = await connection.query(
    "INSERT INTO courses (course_code, title, instructor_id) VALUES (?, ?, ?)",
    [course_code, title, instructor_id]
  );
  return result.insertId;
};

exports.update = async (
  connection,
  id,
  { course_code, title, instructor_id }
) => {
  return await updateMysqlUtil(connection, "courses", id, {
    course_code,
    title,
    instructor_id,
  });
};

exports.remove = async (connection, id) => {
  const [result] = await connection.query("DELETE FROM courses WHERE id = ?", [
    id,
  ]);
  return result.affectedRows;
};
