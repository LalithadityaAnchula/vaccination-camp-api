const express = require("express");
const {
  authenticate,
  register,
  login,
  getMe,
  logout,
  updateMe,
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

module.exports = router;
