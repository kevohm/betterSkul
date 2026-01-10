/**
 * Generic update function for any table
 * @param {object} connection - MySQL connection
 * @param {string} table - Table name
 * @param {number|string} id - ID of the row to update
 * @param {object} data - Fields to update (only defined keys will be updated)
 * @param {string} idColumn - Name of the id column (default: "id")
 * @returns {number} - Number of affected rows
 */
exports.updateMysqlUtil = async (connection, table, id, data = {}, idColumn = "id") => {
  // Extract only defined fields
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  // Nothing to update
  if (fields.length === 0) {
    return 0;
  }

  // Add id for WHERE clause
  values.push(id);

  const sql = `UPDATE ${table} SET ${fields.join(", ")} WHERE ${idColumn} = ?`;
  const [result] = await connection.query(sql, values);

  return result.affectedRows;
};
