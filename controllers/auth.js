const _ = require("lodash");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

//@desc  Register a user
//@route POST /api/v1/auth/register
//@access Public

exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, aadhar } = req.body;

  //create user
  const user = await User.create({
    firstName: _.capitalize(firstName),
    lastName: _.capitalize(lastName),
    email,
    phone,
    aadhar,
    password,
  });

  sendTokenResponse(user, 200, res);
});

//@desc  Login a user
//@route POST /api/v1/auth/authenticate
//@access Public

exports.authenticate = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: {}, role: req.user.role });
});

//@desc  Login a user
//@route POST /api/v1/auth/login
//@access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //validating email and password
  if (!email || !password)
    return next(new ErrorResponse("Please provide an email and password", 400));

  //check if user exists
  const user = await User.findOne({ email }).select("+password");

  //check if user exists
  if (!user) return next(new ErrorResponse("Invalid credentials", 401));

  //check if password is correct
  const isMatch = await user.matchPassword(password);

  if (!isMatch) return next(new ErrorResponse("Invalid credentials", 401));

  sendTokenResponse(user, 200, res);
});

//@desc  logout the user
//@route GET /api/v1/auth/logout
//@access Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

//@desc  Get current user
//@route GET /api/v1/auth/me
//@access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user, role: user.role });
});

//@desc  Update user
//@route PUT /api/v1/auth/me
//@access Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, phone, aadhar, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { firstName, lastName, phone, aadhar, email },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: user });
});

//Get token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") {
    options.secure = true;
    options.sameSite = "strict";
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, data: user, role: user.role });
};
