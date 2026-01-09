const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Routes
const studentRoutes = require("./src/routes/student.route");
const { pool, testDBConnection } = require("./db");
// const mentorRoutes = require("./routes/mentors");
// const courseRoutes = require("./routes/courses");
// const jobRoutes = require("./routes/jobs");
// const eventRoutes = require("./routes/events");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount routes
app.use("/api/students", studentRoutes);
// app.use("/api/mentors", mentorRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/events", eventRoutes);


// Start server only if DB connection succeeds
const startServer = async () => {
  await testDBConnection(); // check DB
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
