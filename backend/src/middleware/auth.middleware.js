const jwt = require("jsonwebtoken");
const { cookieName } = require("../utils/cookie");
const { ForbiddenError, UnauthorizedError } = require("../errors/http.error");
const { InsufficientPermissionsError } = require("../errors/permission.error");
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
const UserRole = require("../repository/user.repository");
const { pool } = require("../../db");

exports.authGuard = async (req, res, next) => {
  const token = req.cookies[cookieName];
  try {

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await UserRole.findById(pool, decoded?.userId);

    req.user = { userId: user.id, role: user?.role };
    
    next();
  } catch {
    throw new UnauthorizedError("invalid token");
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
