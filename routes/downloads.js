const express = require("express");
const { protect } = require("../middleware/auth");
const { getCertificate } = require("../controllers/downloads");

const router = express.Router();

router.route("/:doseType").get(protect, getCertificate);

module.exports = router;
