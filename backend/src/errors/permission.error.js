const { ForbiddenError } = require("./http.error");

class InsufficientPermissionsError extends ForbiddenError {
  constructor() {
    super(
      "You do not have permission to perform this action",
      "INSUFFICIENT_PERMISSIONS"
    );
  }
}

module.exports = {
  InsufficientPermissionsError,
};
