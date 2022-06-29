const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  //Logging to console
  console.log(err);

  //Error for bad object id
  if (err.name == "CastError") {
    const message = `Resource not found with parameter ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  //Mongoose duplicate key error
  if (err.code == 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }
  //Mongoose validation error
  if (err.name == "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    data: {},
    msg: error.message || "Server Error",
  });
};

module.exports = errorHandler;
