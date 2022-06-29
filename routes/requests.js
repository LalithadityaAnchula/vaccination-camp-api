const express = require("express");
const { getRequests, acceptRequest } = require("../controllers/requests");

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getRequests);
router.route("/:requestId").delete(protect, authorize("admin"), acceptRequest);

module.exports = router;
