const express = require("express");
const {
  getCamps,
  getCamp,
  createCamp,
  updateCamp,
} = require("../controllers/camps");
const Camp = require("../models/Camp");
const advancedResults = require("../middleware/advancedResults");

//Includes other routes
const slotsRouter = require("./slots");

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

//Mount other routes
router.use("/:campId/slots", slotsRouter);

router
  .route("/")
  .get(protect, advancedResults(Camp), getCamps)
  .post(protect, authorize("admin"), createCamp);

router
  .route("/:campId")
  .get(protect, authorize("admin"), getCamp)
  .put(protect, authorize("admin"), updateCamp);

module.exports = router;
