const mysql = require("mysql2/promise");

// Configure your DB connection
const pool = mysql.createPool({
  host: process.env.DB_HOST, // or your DB host
  user: process.env.DB_USER, // your DB user
  password: process.env.DB_PASSWORD, // your DB password
  database:  process.env.DB_NAME, // the DB you want to use
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
