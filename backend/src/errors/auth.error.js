const { UnauthorizedError, ForbiddenError } = require("./http.error");

class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super("Invalid credentials", "INVALID_CREDENTIALS");
  }
}

class TokenExpiredError extends UnauthorizedError {
  constructor() {
    super("Token expired", "TOKEN_EXPIRED");
  }
}

class AccountDisabledError extends ForbiddenError {
  constructor() {
    super("Account disabled", "ACCOUNT_DISABLED");
  }
}

module.exports = {
  InvalidCredentialsError,
  TokenExpiredError,
  AccountDisabledError,
};
