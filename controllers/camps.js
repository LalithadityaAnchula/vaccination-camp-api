const _ = require("lodash/string");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const City = require("../models/City");
const Camp = require("../models/Camp");

//@desc  Get all camps
//@route GET /api/v1/camps
//@access Private
exports.getCamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc  Create new camp
//@route GET /api/v1/camps
//@access Private
exports.createCamp = asyncHandler(async (req, res, next) => {
  //capitalize city name & address
  req.body.name = _.startCase(req.body.name);
  //Getting that city
  const city = await City.findById(req.params.cityId);
  if (!city) {
    return next(
      new ErrorResponse(`City not found with id ${req.params.cityId}`, 404)
    );
  }
  //Checking availability in city
  if (city.available === 0)
    return next(
      new ErrorResponse(`No more camps can be ceated in ${city.name}`, 404)
    );
  //Creating camp
  const camp = await Camp.create(req.body);
  //update availability
  city.available -= 1;
  //save the updated city document
  await city.save();
  res.status(201).json({ success: true, data: camp });
});

//@desc  Get one camp
//@route GET /api/v1/camps/:campId
//@access Private
exports.getCamp = asyncHandler(async (req, res, next) => {
  const camp = await Camp.findById(req.params.campId);
  if (!camp)
    return next(
      new ErrorResponse(`Camp not found with id ${req.params.campId}`, 404)
    );
  res.status(200).json({ success: true, data: camp });
});

//@desc  Update one camp
//@route PUT /api/v1/camps/:campId
//@access Private
exports.updateCamp = asyncHandler(async (req, res, next) => {
  req.body.name = _.capitalize(req.body.name);
  const camp = await Camp.findByIdAndUpdate(req.params.campId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!camp)
    return next(
      new ErrorResponse(`Camp not found with id ${req.params.campId}`, 404)
    );
  res.status(200).json({ success: true, data: camp });
});
