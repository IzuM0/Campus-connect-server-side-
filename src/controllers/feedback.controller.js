const Feedback = require("../models/Feedback");

// Public: create new feedback
const createFeedback = async (req, res) => {
  try {
    const { category, content } = req.body;
    if (!category || !content) return res.status(400).json({ message: "Category and content required" });

    const feedback = await Feedback.create({ category, content });
    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: list feedbacks (with optional filters)
const getFeedbacks = async (req, res) => {
  try {
    const { category, status, keyword } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (keyword) filter.$or = [
      { content: { $regex: keyword, $options: "i" } },
      { response: { $regex: keyword, $options: "i" } }
    ];

    const feedbacks = await Feedback.find(filter).sort({ date_submitted: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: update feedback (status, mark as read, add response)
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    if (status) feedback.status = status;
    if (response) {
      feedback.response = response;
      feedback.responded_at = new Date();
      feedback.responded_by = req.adminId; // assume admin JWT middleware sets req.adminId
    }

    feedback.is_read = true;

    await feedback.save();
    res.json({ message: "Feedback updated", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createFeedback, getFeedbacks, updateFeedback };