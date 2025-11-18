const express = require("express");
const router = express.Router();
const { createFeedback, getFeedbacks, updateFeedback } = require("../controllers/feedback.controller");

// Public route: students submit feedback
router.post("/", createFeedback);

// Admin routes: protected (middleware to verify JWT)
router.get("/", getFeedbacks);        // List all feedback, with filters
router.put("/:id", updateFeedback);   // Update feedback (status, response, mark read)

module.exports = router;