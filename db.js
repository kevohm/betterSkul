const mysql = require("mysql2/promise");

// Configure your DB connection
const opts = {
  host: process.env.DB_HOST, // or your DB host
  user: process.env.DB_USER, // your DB user
  password: process.env.DB_PASSWORD, // your DB password
  database: process.env.DB_NAME, // the DB you want to use
  port:process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
const pool = mysql.createPool(opts);

// console.log(opts)
module.exports = {pool}
