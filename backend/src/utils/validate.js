const { ValidationError } = require("../errors/validation.error");

exports.validate = (schema, data) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const fields = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    throw new ValidationError("Invalid request data", fields);
  }

  return result.data;
};
