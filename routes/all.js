const express = require("express");
const City = require("../models/City");
const Camp = require("../models/Camp");
const { getCities } = require("../controllers/cities");
const { getCamps } = require("../controllers/camps");

const router = express.Router();
const { protect } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.route("/cities").get(protect, advancedResults(City), getCities);
router.route("/camps").get(protect, advancedResults(Camp), getCamps);

module.exports = router;
