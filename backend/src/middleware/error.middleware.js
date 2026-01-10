const AppError = require("../errors/app.error");
const { handleMySQLError } = require("../errors/mysql.error");

module.exports = (err, req, res, next) => {
  console.log("ERROR: ", err)
  // MySQL errors
  if (err.code && err.sqlState) {
    const dbError = handleMySQLError(err);
    return res.status(dbError.status).json({
      status: "error",
      message: dbError.message,
    });
  }

  // Known application errors
  if (err instanceof AppError) {
    const response = {
      message: err.message,
      code: err.code,
    };

    if (err.fields) {
      response.fields = err.fields;
    }

    return res.status(err.statusCode).json(response);
  }

  // Fallback (unknown errors)
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
