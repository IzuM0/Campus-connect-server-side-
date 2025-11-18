const express = require("express");
const router = express.Router();

// Correct controller import
const {
  getDashboardSummary,
  getRecentFeedback,
  getFeedbackByCategory
} = require("../controllers/dashboard.controller");

// Routes
router.get("/summary", getDashboardSummary);
router.get("/recent-feedback", getRecentFeedback);
router.get("/feedback-by-category", getFeedbackByCategory);

module.exports = router;