const express = require("express");
const router = express.Router();

const { 
  login, 
  forgotPassword, 
  resetPassword, 
  deleteMessage 
} = require("../controllers/auth.controller");

// Admin login
router.post("/login", login);

// DELETE a message (Admin only)
router.delete("/messages/:id", deleteMessage);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

module.exports = router;
