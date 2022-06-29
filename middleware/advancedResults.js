const asyncHandler = require("./async");
const City = require("../models/City");
const Camp = require("../models/Camp");
const advancedResults = (model, populate) =>
  asyncHandler(async (req, res, next) => {
    if (req.query.search != "") {
      let query;
      //copy req.query
      const reqQuery = { ...req.query };

      //fields to exclude
      const removeFields = ["search", "sort", "page", "limit"];

      //loop over removeFields and delete them from reqQuery
      removeFields.forEach((param) => {
        delete reqQuery[param];
      });

      //create query string
      let queryStr = JSON.stringify(reqQuery);

      //create operators ($gt, $gte, etc)
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
      );

      //Creating query object
      let queryObject = JSON.parse(queryStr);

      //adding search target to query
      queryObject.name = new RegExp("^" + req.query.search, "i");

      //creating a query
      if (model === City) {
        query = model.find(queryObject);
      } else if (model == Camp) {
        query = model
          .find({
            $or: [
              { name: new RegExp("^" + req.query.search, "i") },
              { address: new RegExp("^" + req.query.search, "i") },
            ],
          })
          .populate("city");
      }

      // Select Fields
      if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
      }

      //Sort fields
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("+name");
      }

      //Executing query
      const results = await query;

      res.advancedResults = {
        success: true,
        count: results.length,
        data: results,
        role: req.user.role,
      };
    } else {
      let results = [];
      if (model === City) {
        results = await model.find({ isMetroPolitan: true });
      } else if (model == Camp) {
        results = await model.find({ city: req.params.cityId });
      }
      res.advancedResults = {
        success: true,
        count: results.length,
        data: results,
        role: req.user.role,
      };
    }
    next();
  });

module.exports = advancedResults;
