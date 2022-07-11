const express = require("express");
const {
  authenticate,
  register,
  login,
  getMe,
  logout,
  updateMe,
  getActiveSessions,
  terminateSessions,
  terminateSession,
} = require("../controllers/auth");

const router = express.Router();
const { protect } = require("../middleware/auth");

router
  .get("/authenticate", protect, authenticate)
  .post("/register", register)
  .post("/login", login)
  .get("/logout", logout)
  .get("/me", protect, getMe)
  .put("/me", protect, updateMe);

router
  .get("/sessions", protect, getActiveSessions)
  .delete("/sessions", protect, terminateSessions)
  .delete("/sessions/:id", protect, terminateSession);

module.exports = router;
