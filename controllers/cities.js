const _ = require("lodash/string");
const City = require("../models/City");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { SchemaTypeOptions } = require("mongoose");

//@desc  Get all cities
//@route GET /api/v1/cities
//@access Private
exports.getCities = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc  Create new city
//@route GET /api/v1/cities
//@access Private
exports.createCity = asyncHandler(async (req, res, next) => {
  //capitalize city name
  req.body.name = _.capitalize(req.body.name);
  //Get user id from body
  const city = await City.create(req.body);
  res.status(201).json({ success: true, data: city });
});

//@desc  Get one city
//@route GET /api/v1/city/:id
//@access Private
exports.getCity = asyncHandler(async (req, res, next) => {
  const city = await City.findById(req.params.cityId);
  if (!city)
    return next(
      new ErrorResponse(`City not found with id ${req.params.cityId}`, 404)
    );
  res.status(200).json({ success: true, data: city });
});

//@desc  Update one city
//@route PUT /api/v1/cities/:id
//@access Private
exports.updateCity = asyncHandler(async (req, res, next) => {
  req.body.name = _.capitalize(req.body.name);
  const city = await City.findByIdAndUpdate(req.params.cityId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!city)
    return next(
      new ErrorResponse(`City not found with id ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: city });
});

//@desc  GET vaccination Stats
//@route GET /api/v1/cities/:id/statss
//@access Private
exports.getStats = asyncHandler(async (req, res, next) => {
  //Getting users with first dose
  const results = await User.find({
    "firstDose.camp.city.name": req.params.cityName,
  })
    .setOptions({ strictQuery: false })
    .select("firstDose secondDose");

  let vaccinatedPeople = 0;
  //Counting vaccinated people in results
  results.forEach((result) => {
    if (result.secondDose !== undefined) vaccianted += 1;
  });

  //Getting population of city
  const city = await City.findOne({ name: req.params.cityName });
  const population = city.population;
  res.status(200).json({
    success: true,
    data: {
      partiallyVaccinated: results.length,
      vaccinated: vaccinatedPeople,
      population,
      nonVaccinated: city.population - results.length,
    },
  });
});
