const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");

//Protect routes

exports.protect = asyncHandler(async (req, res, next) => {
  //Check for valid session
  if (!req.session.userId) {
    return next(new ErrorResponse("Please login to access this route", 401));
  } else {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return next(new ErrorResponse("Please login to access this route", 401));
    }
    req.user = user;
    next();
  }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
