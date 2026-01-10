require("express-async-errors")
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { pool, testDBConnection } = require("./db");

// Routes
const authRouter = require("./src/routes/auth.routes");
const errorMiddleware = require("./src/middleware/error.middleware");
const studentsRouter = require("./src/routes/student.routes");
const usersRouter = require("./src/routes/users.router");
const instructorsRouter = require("./src/routes/instructors.router");
const coursesRouter = require("./src/routes/courses.router");
const enrollmentsRouter = require("./src/routes/enrollments.router");



const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.get("/api/v1/health", async (req, res) => {
  try {
    res.status(200).json({
      status: "ok",
      service: "api",
      version: process.env.APP_VERSION || "unknown",
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
    });
  }
});


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/students", studentsRouter);
app.use("/api/v1/instructors", instructorsRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/enrollments", enrollmentsRouter);


app.use(errorMiddleware)
// Start server only if DB connection succeeds
const startServer = async () => {
  await testDBConnection(); // check DB
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
