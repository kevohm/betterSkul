const jwt = require("jsonwebtoken");
const { cookieName } = require("../utils/cookie");
const { ForbiddenError, UnauthorizedError } = require("../errors/http.error");
const { InsufficientPermissionsError } = require("../errors/permission.error");
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
const userRepo = require("../repository/user.repository");
const { pool } = require("../../db");


exports.authGuard = async (req, res, next) => {
  const token = req.cookies?.[cookieName];

  if (!token) {
    throw new UnauthorizedError("Authentication required");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await userRepo.findById(pool, decoded.userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    let full_name = null;

    if (user.role === "student") {
      const [rows] = await pool.query(
        "SELECT first_name, last_name FROM students WHERE user_id = ?",
        [user.id]
      );
      const student = rows[0];
      full_name = student ? `${student.first_name} ${student.last_name}` : null;
    }

    if (user.role === "instructor") {
      const [rows] = await pool.query(
        "SELECT full_name FROM instructors WHERE user_id = ?",
        [user.id]
      );
      const instructor = rows[0];
      console.log(instructor)
      full_name = instructor?.full_name || null;
    }

    req.user = {
      userId: user.id,
      role: user.role,
      full_name,
    };

    next();
  } catch (err) {
    console.log(err)
    throw new UnauthorizedError("Invalid or expired token");
  }
};


/**
 * Role-based guard
 */
exports.roleGuard = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    throw new InsufficientPermissionsError();
  }
  next();
};
