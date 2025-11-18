const Feedback = require("../models/feedback");

// Get summary metrics
const getDashboardSummary = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const unread = await Feedback.countDocuments({ is_read: false });
    const responded = await Feedback.countDocuments({ response: { $ne: null } });
    const responseRate = total ? (responded / total) * 100 : 0;

    // Average response time
    const feedbacksWithResponse = await Feedback.find({ response: { $ne: null } });
    const avgResponseTime =
      feedbacksWithResponse.length > 0
        ? feedbacksWithResponse.reduce((sum, f) => sum + (f.responded_at - f.date_submitted), 0) /
          feedbacksWithResponse.length
        : 0;

    res.json({
      total,
      unread,
      responseRate,
      avgResponseTime, // in milliseconds; frontend can convert to hours/days
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get recent submissions
const getRecentFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date_submitted: -1 }).limit(10);
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get feedback grouped by category
const getFeedbackByCategory = async (req, res) => {
  try {
    const categories = await Feedback.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardSummary, getRecentFeedback, getFeedbackByCategory };