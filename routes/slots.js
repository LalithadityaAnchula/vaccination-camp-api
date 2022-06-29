const express = require("express");
const { getSlots, createSlot, bookSlot } = require("../controllers/slots");

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getSlots)
  .post(protect, authorize("admin"), createSlot);

router.route("/:slotId/book").put(protect, bookSlot);

module.exports = router;
