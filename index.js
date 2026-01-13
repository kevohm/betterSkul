const express = require("express");
const cors = require("cors");
const dotenvx = require("@dotenvx/dotenvx")
dotenvx.config({path:
  process.env.NODE_ENV === "production" ? ".env" :".env.development"
})

const {pool} = require("./db")
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://better-skul.vercel.app"]
        : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

/* =========================
   RATE LIMITING
========================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

/* =========================
   SQL VALIDATION (NON-BLOCKING)
========================= */
const validateQueryRequest = (req, res, next) => {
  const { sql } = req.body;

  if (!sql || typeof sql !== "string") {
    return res.status(400).json({
      success: false,
      error: "SQL query must be a non-empty string",
      code: "INVALID_SQL",
    });
  }

  if (sql.length > 20000) {
    return res.status(413).json({
      success: false,
      error: "SQL query too long",
      code: "QUERY_TOO_LONG",
    });
  }

  next();
};

/* =========================
   QUERY EXECUTION
========================= */
app.post("/api/query", validateQueryRequest, async (req, res, next) => {
  const { sql, parameters = [], timeout = 10000 } = req.body;

  let connection;

  try {
    connection = await pool.getConnection();

    // Set execution timeout
    await connection.query(
      `SET SESSION MAX_EXECUTION_TIME=${Number(timeout) || 10000}`
    );

    const start = Date.now();

    const [result, fields] =
      parameters.length > 0
        ? await connection.execute(sql, parameters)
        : await connection.query(sql);

    const durationMs = Date.now() - start;

    /* =========================
       RESPONSE NORMALIZATION
    ========================= */
    // SELECT
    if (Array.isArray(result)) {
      return res.json({
        success: true,
        type: "SELECT",
        rowCount: result.length,
        rows: result,
        fields: fields?.map((f) => f.name) || [],
        executionTimeMs: durationMs,
      });
    }

    // INSERT / UPDATE / DELETE / DDL
    return res.json({
      success: true,
      type: "MODIFY",
      affectedRows: result.affectedRows ?? 0,
      insertId: result.insertId ?? null,
      warningCount: result.warningCount ?? 0,
      message: result.message ?? "Query executed successfully",
      executionTimeMs: durationMs,
    });
  } catch (err) {
    next(err);
  } finally {
    if (connection) connection.release();
  }
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.log(err)
    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
      error: err.message,
    });
  }
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("SQL / Server Error:", {
    message: err.message,
    code: err.code,
    stack: err.stack,
  });

  const mysqlErrors = {
    ER_PARSE_ERROR: [400, "SQL syntax error"],
    ER_NO_SUCH_TABLE: [404, "Table not found"],
    ER_BAD_DB_ERROR: [400, "Database not found"],
    ER_DUP_ENTRY: [409, "Duplicate entry"],
    ER_ACCESS_DENIED_ERROR: [403, "Database access denied"],
    PROTOCOL_CONNECTION_LOST: [503, "Database connection lost"],
    ECONNREFUSED: [503, "Database connection refused"],
    ETIMEDOUT: [504, "Query timeout"],
  };

  if (mysqlErrors[err.code]) {
    const [status, message] = mysqlErrors[err.code];
    return res.status(status).json({
      success: false,
      error: message,
      code: err.code,
      details:
        process.env.NODE_ENV === "development" ? err.sqlMessage : undefined,
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    code: "ENDPOINT_NOT_FOUND",
  });
});

/* =========================
   SERVER START & SHUTDOWN
========================= */
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`
  );
});

const gracefulShutdown = async () => {
  console.log("Shutting down server...");
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

module.exports = app;
