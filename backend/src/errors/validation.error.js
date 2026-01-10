const { BadRequestError } = require("./http.error");

class ValidationError extends BadRequestError {
  constructor(message = "Validation failed", fields = []) {
    super(message, "VALIDATION_ERROR");
    this.fields = fields;
  }
}

module.exports = {
  ValidationError,
};
