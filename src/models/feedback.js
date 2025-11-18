const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ["Suggestion", "Complaint", "Appreciation", "Question"], 
    required: true 
  },
  content: { type: String, maxlength: 500, required: true },
  status: { type: String, default: "New" },
  is_read: { type: Boolean, default: false },
  date_submitted: { type: Date, default: Date.now },
  response: { type: String, default: null },
  responded_at: { type: Date, default: null },
  responded_by: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null }
});

// Fix for OverwriteModelError
const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;