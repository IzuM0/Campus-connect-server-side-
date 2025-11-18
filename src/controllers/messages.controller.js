const Message = require("../models/message");

// Create a new message
const createMessage = async (req, res) => {
  const { text } = req.body;

  // Validate input
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    const newMessage = new Message({ text });
    await newMessage.save();
    return res.status(201).json({ message: "Message created successfully", newMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// List messages with simple pagination
const listMessages = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const total = await Message.countDocuments();
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({ page, limit, total, messages });
  } catch (error) {
    console.error("Error listing messages:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Like a message
const likeMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Ensure likes field exists
    if (typeof message.likes !== "number") {
      message.likes = 0;
    }

    // Increment likes
    message.likes += 1;

    await message.save();

    // Return clean data
    return res.json({
      _id: message._id,
      text: message.text,
      category: message.category,
      likes: message.likes,
      timestamp: message.createdAt
    });

  } catch (error) {
    console.error("Error liking message:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a message (admin)
const updateMessage = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!updateData || Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Update data is required" });
  }

  updateData.updatedAt = Date.now();

  try {
    const message = await Message.findByIdAndUpdate(id, updateData, { new: true });

    if (!message) return res.status(404).json({ message: "Message not found" });

    return res.status(200).json({ message: "Message updated successfully", message });
  } catch (error) {
    console.error("Error updating message:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete a message (admin)
const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByIdAndDelete(id);

    if (!message) return res.status(404).json({ message: "Message not found" });

    return res.status(200).json({ message: "Message deleted successfully", id });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  createMessage,
  listMessages,
  likeMessage,
  updateMessage,
  deleteMessage,
};
