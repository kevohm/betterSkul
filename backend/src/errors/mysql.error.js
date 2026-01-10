/**
 * Centralized MySQL error handler
 * Converts MySQL error codes into AppErrors
 */

const {
  DuplicateEntryError,
  InvalidReferenceError,
  MissingFieldError,
  DataTooLongError,
  QuerySyntaxError,
  DatabaseAccessError,
  DatabaseBusyError,
  GenericDatabaseError,
} = require("./database.error");

exports.handleMySQLError = (err) => {
  console.error("MySQL Error:", {
    code: err.code,
    errno: err.errno,
    sqlMessage: err.sqlMessage,
    sqlState: err.sqlState,
    stack: err.stack,
  });

  switch (err.code) {
    case "ER_DUP_ENTRY":
      throw new DuplicateEntryError();

    case "ER_NO_REFERENCED_ROW_2":
    case "ER_ROW_IS_REFERENCED_2":
      throw new InvalidReferenceError();

    case "ER_BAD_NULL_ERROR":
      throw new MissingFieldError();

    case "ER_DATA_TOO_LONG":
      throw new DataTooLongError();

    case "ER_PARSE_ERROR":
      throw new QuerySyntaxError();

    case "ER_ACCESS_DENIED_ERROR":
      throw new DatabaseAccessError();

    case "ER_LOCK_WAIT_TIMEOUT":
    case "ER_LOCK_DEADLOCK":
      throw new DatabaseBusyError();

    default:
      throw new GenericDatabaseError();
  }
};
