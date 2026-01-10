const { NotFoundError } = require("../errors/http.error");
const { updateMysqlUtil } = require("../utils/update.mysql");

exports.findAll = async (connection, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;

  const [[{ total }]] = await connection.query(
    "SELECT COUNT(*) AS total FROM enrollments"
  );

  const [rows] = await connection.query(
    "SELECT * FROM enrollments LIMIT ? OFFSET ?",
    [pageSize, offset]
  );

  return {
    data: rows,
    total,
    page,
    pageSize,
  };
};

exports.findById = async (connection, studentId, courseId) => {
  const [rows] = await connection.query(
    "SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?",
    [studentId, courseId]
  );
  return rows[0];
};

exports.findByIdSecurely = async (connection, studentId, courseId) => {
  const enrollment = await this.findById(connection, studentId, courseId);
  if (!enrollment) {
    throw new NotFoundError("Enrollment not found");
  }
  return enrollment;
};

exports.findByStudentId = async (connection, studentId) => {
  const [rows] = await connection.query(
    "SELECT * FROM enrollments WHERE student_id = ?",
    [studentId]
  );
  return rows;
};

exports.findByCourseId = async (connection, courseId) => {
  const [rows] = await connection.query(
    "SELECT * FROM enrollments WHERE course_id = ?",
    [courseId]
  );
  return rows;
};

exports.create = async (connection, { student_id, course_id, grade }) => {
  const [result] = await connection.query(
    "INSERT INTO enrollments (student_id, course_id, grade) VALUES (?, ?, ?)",
    [student_id, course_id, grade]
  );
  return result;
};

exports.update = async (connection, studentId, courseId, { grade }) => {
  // Since enrollments has composite primary key, we need custom update
  const [result] = await connection.query(
    "UPDATE enrollments SET grade = ? WHERE student_id = ? AND course_id = ?",
    [grade, studentId, courseId]
  );
  return result.affectedRows;
};

exports.remove = async (connection, studentId, courseId) => {
  const [result] = await connection.query(
    "DELETE FROM enrollments WHERE student_id = ? AND course_id = ?",
    [studentId, courseId]
  );
  return result.affectedRows;
};
