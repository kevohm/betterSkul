// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // reuse connections
  queueLimit: 0,
});


// Function to test DB connection
const testDBConnection = async () => {
  try {
    const [rows] = await pool.query("SELECT 1"); // simple query
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Exit the process if DB connection fails
  }
};


module.exports = {
  pool,
  testDBConnection
}
