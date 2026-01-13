const express = require("express");
const { pool } = require("./db"); // your existing db pool
const cors = require("cors");

const app = express();
app.use(express.json());

// Enhanced CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"] // Specify allowed origins in production
        : "*", // Allow all in development
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Rate limiting middleware (add rate-limiter package: npm install express-rate-limit)
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Request validation middleware
const validateQueryRequest = (req, res, next) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({
      error: "SQL command is required",
      code: "SQL_REQUIRED",
    });
  }

  if (typeof sql !== "string") {
    return res.status(400).json({
      error: "SQL must be a string",
      code: "INVALID_SQL_TYPE",
    });
  }

  // Basic SQL injection prevention (whitelist approach is better)
  const dangerousPatterns = [
    /DROP\s+(DATABASE|TABLE|SCHEMA)/i,
    /DELETE\s+FROM.*WHERE.*\d+=\d+/i,
    /ALTER\s+(DATABASE|TABLE|SCHEMA)/i,
    /CREATE\s+(DATABASE|TABLE|SCHEMA)/i,
    /INSERT\s+INTO/i,
    /UPDATE.*SET.*WHERE/i,
    /TRUNCATE/i,
    /GRANT/i,
    /REVOKE/i,
    /;\s*DROP/i,
    /;\s*DELETE/i,
    /;\s*INSERT/i,
    /;\s*UPDATE/i,
    /--/,
    /\/\*/,
    /UNION.*SELECT/i,
  ];

  // Allow SELECT queries only (adjust based on your needs)
  const isSelectQuery = sql.trim().toUpperCase().startsWith("SELECT");
  if (!isSelectQuery) {
    return res.status(403).json({
      error: "Only SELECT queries are allowed",
      code: "QUERY_TYPE_NOT_ALLOWED",
    });
  }

  // Check for dangerous patterns
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sql)) {
      return res.status(403).json({
        error: "Potentially dangerous SQL detected",
        code: "DANGEROUS_SQL_DETECTED",
      });
    }
  }

  // Limit query length
  if (sql.length > 10000) {
    return res.status(413).json({
      error: "SQL query too long",
      code: "QUERY_TOO_LONG",
    });
  }

  next();
};

// Enhanced error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  });

  if (err.code === "ER_PARSE_ERROR") {
    return res.status(400).json({
      error: "SQL syntax error",
      details: err.message,
      code: "SQL_SYNTAX_ERROR",
    });
  }

  if (err.code === "ER_NO_SUCH_TABLE") {
    return res.status(404).json({
      error: "Table does not exist",
      code: "TABLE_NOT_FOUND",
    });
  }

  if (err.code === "ER_ACCESS_DENIED_ERROR") {
    return res.status(403).json({
      error: "Database access denied",
      code: "DB_ACCESS_DENIED",
    });
  }

  if (err.code === "ER_BAD_DB_ERROR") {
    return res.status(400).json({
      error: "Database does not exist",
      code: "DATABASE_NOT_FOUND",
    });
  }

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      error: "Duplicate entry",
      code: "DUPLICATE_ENTRY",
    });
  }

  // Handle database connection errors
  if (err.code === "ECONNREFUSED" || err.code === "PROTOCOL_CONNECTION_LOST") {
    return res.status(503).json({
      error: "Database connection failed",
      code: "DB_CONNECTION_ERROR",
      message: "Please try again later",
    });
  }

  // Handle query timeout
  if (err.code === "ETIMEDOUT") {
    return res.status(504).json({
      error: "Database query timeout",
      code: "QUERY_TIMEOUT",
    });
  }

  // Default error response
  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

// Endpoint to execute SQL with comprehensive error handling
app.post("/api/query", validateQueryRequest, async (req, res, next) => {
  const { sql, parameters = [], timeout = 10000 } = req.body;

  try {
    // Get connection from pool with timeout
    const connection = await pool.getConnection();

    try {
      // Set query timeout
      await connection.query(`SET SESSION MAX_EXECUTION_TIME=${timeout}`);

      // Execute query with parameterized statements if parameters are provided
      const [rows, fields] =
        parameters.length > 0
          ? await connection.execute(sql, parameters)
          : await connection.execute(sql);

      connection.release();

      // Sanitize response (optional)
      const sanitizedRows = rows.map((row) => {
        const sanitized = {};
        for (const [key, value] of Object.entries(row)) {
          // Convert Buffer to string if needed
          if (Buffer.isBuffer(value)) {
            sanitized[key] = value.toString();
          } else {
            sanitized[key] = value;
          }
        }
        return sanitized;
      });

      res.json({
        success: true,
        rows: sanitizedRows,
        fields: fields?.map((field) => field.name) || [],
        rowCount: rows.length,
        executionTime: new Date().toISOString(),
      });
    } catch (queryError) {
      connection.release();
      throw queryError;
    }
  } catch (err) {
    next(err); // Pass to error handler middleware
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
      error: err.message,
    });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    code: "ENDPOINT_NOT_FOUND",
  });
});

// Use error handler middleware
app.use(errorHandler);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Graceful shutdown
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const PORT = process.env.PORT || 4000;

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("Received shutdown signal, closing server...");

  server.close(async () => {
    console.log("HTTP server closed");

    try {
      await pool.end();
      console.log("Database pool closed");
      process.exit(0);
    } catch (err) {
      console.error("Error closing database pool:", err);
      process.exit(1);
    }
  });

  // Force shutdown after timeout
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

const server = app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});

// Listen for shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

module.exports = app; // For testing
