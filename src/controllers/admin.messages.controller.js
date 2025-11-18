const Message = require("../models/message.model");

const deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { deleteMessage };
