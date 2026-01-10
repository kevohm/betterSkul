const cors = require("cors")
// List of allowed origins (multiple clients)
const allowedOrigins = [
  "http://localhost:5173", // local frontend 1
  "http://localhost:4173", // local frontend 2
  "https://myapp.com", // production frontend
];

exports.corsMiddleware = cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies
  });
