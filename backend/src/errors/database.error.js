const {
  BadRequestError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError,
} = require("./http.error");

class DuplicateEntryError extends ConflictError {
  constructor() {
    super("Resource already exists", "DB_DUPLICATE_ENTRY");
  }
}

class InvalidReferenceError extends BadRequestError {
  constructor() {
    super("Invalid reference", "DB_INVALID_REFERENCE");
  }
}

class MissingFieldError extends BadRequestError {
  constructor() {
    super("Missing required field", "DB_MISSING_FIELD");
  }
}

class DataTooLongError extends BadRequestError {
  constructor() {
    super("Provided data is too long", "DB_DATA_TOO_LONG");
  }
}

class QuerySyntaxError extends BadRequestError {
  constructor() {
    super("Invalid query syntax", "DB_QUERY_SYNTAX_ERROR");
  }
}

class DatabaseAccessError extends InternalServerError {
  constructor() {
    super("Database access denied", "DB_ACCESS_DENIED");
  }
}

class DatabaseBusyError extends ServiceUnavailableError {
  constructor() {
    super("Database busy, try again later", "DB_BUSY");
  }
}

class GenericDatabaseError extends InternalServerError {
  constructor() {
    super("Internal database error", "DB_INTERNAL_ERROR");
  }
}

module.exports = {
  DuplicateEntryError,
  InvalidReferenceError,
  MissingFieldError,
  DataTooLongError,
  QuerySyntaxError,
  DatabaseAccessError,
  DatabaseBusyError,
  GenericDatabaseError,
};
