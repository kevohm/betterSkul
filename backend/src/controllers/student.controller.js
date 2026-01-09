const pool = require("../../db");

// GET all students
exports.getStudents = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one student
exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Student not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE student
exports.createStudent = async (req, res) => {
  const { name, email, enrollment_year } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO students (name, email, enrollment_year) VALUES (?, ?, ?)",
      [name, email, enrollment_year]
    );
    res.status(201).json({ id: result.insertId, name, email, enrollment_year });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE student
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, enrollment_year } = req.body;
  try {
    await pool.query(
      "UPDATE students SET name = ?, email = ?, enrollment_year = ? WHERE id = ?",
      [name, email, enrollment_year, id]
    );
    res.json({ id, name, email, enrollment_year });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM students WHERE id = ?", [id]);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
