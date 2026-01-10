const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { JWT_EXPIRES_IN, JWT_SECRET } = require("../constants/base");
const { pool } = require("../../db");
const withTransaction = require("../utils/withTransaction");
const userRepo = require("../repository/user.repository");

const {
  InvalidCredentialsError,
  AccountDisabledError,
} = require("../errors/auth.error");

const { registerSchema, loginSchema } = require("../validators/auth.schema");
const { validate } = require("../utils/validate");
const { BadRequestError } = require("../errors/http.error");
const { sendCookie, cookieName, removeCookie } = require("../utils/cookie");

exports.register = async (req, res) => {
  const {
    email,
    password,
    role,
    first_name,
    last_name,
    full_name,
    date_of_birth,
  } = validate(registerSchema, req.body);

  const userExists = await userRepo.findByEmail(pool, email);
  if (userExists) {
    throw new BadRequestError("Email already exists");
  }

  await withTransaction(async (connection) => {
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    await connection.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, passwordHash, role]
    );

    if (role === "student") {
      await connection.query(
        "INSERT INTO students (user_id, first_name, last_name, date_of_birth) VALUES (LAST_INSERT_ID(), ?, ?, ?)",
        [first_name, last_name, date_of_birth]
      );
    }

    if (role === "instructor") {
      await connection.query(
        "INSERT INTO instructors (user_id, full_name) VALUES (LAST_INSERT_ID(), ?)",
        [full_name]
      );
    }
  });

  const token = jwt.sign(
    {
      userId,
      role,
      full_name: user.full_name || `${user.first_name} ${user?.last_name}`,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

  sendCookie(res, token);

  res.status(201).json({
    message: "User registered successfully",
  });
};

exports.login = async (req, res) => {
  const { email, password } = validate(loginSchema, req.body);

  const [rows] = await pool.query(
    "SELECT id, password, role, is_active FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length) {
    throw new InvalidCredentialsError();
  }

  const user = rows[0];

  if (!user.is_active) {
    throw new AccountDisabledError();
  }

  const isMatch = await argon2.verify(user.password, password);
  if (!isMatch) {
    throw new InvalidCredentialsError();
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      full_name: user?.full_name || `${user.first_name} ${user?.last_name}`,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

  sendCookie(res, token);
  res.json();
};

exports.logout = async (req, res) => {
  removeCookie(res);

  res.status(200).json({
    message: "Logged out successfully",
  });
};
