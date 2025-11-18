const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 1000 
    },
    author: { 
      type: String, 
      default: "Anonymous" 
    },
    likes: { 
      type: Number, 
      default: 0 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date 
    },
  },
  { timestamps: true } 
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
