const express = require("express");
const City = require("../models/City");
const {
  getCities,
  getCity,
  createCity,
  updateCity,
  getStats,
} = require("../controllers/cities");

//Include other routes
const campsRouter = require("./camps");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

//Mount other routes
router.use("/:cityId/camps", campsRouter);

router
  .route("/")
  .get(protect, advancedResults(City), getCities)
  .post(protect, authorize("admin"), createCity);

router
  .route("/:cityId")
  .get(protect, authorize("admin"), getCity)
  .put(protect, authorize("admin"), updateCity);

router.route("/:cityId/stats").get(protect, authorize("admin"), getStats);

module.exports = router;
