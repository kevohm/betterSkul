const { pool } = require("../../db");


module.exports = async (callback) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err; // bubble up to express-async-errors
  } finally {
    connection.release();
  }
};
