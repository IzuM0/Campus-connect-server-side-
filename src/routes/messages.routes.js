const express = require("express");
const router = express.Router();
const { 
  createMessage, 
  listMessages, 
  likeMessage, 
  updateMessage, 
  deleteMessage 
} = require("../controllers/messages.controller");
const { authAdmin } = require("../middleware/auth.middleware");

// Public routes
router.get("/", listMessages);
router.post("/", createMessage);
router.post("/:id/like", likeMessage);

// Admin routes
router.put("/:id", authAdmin, updateMessage);
router.delete("/:id", authAdmin, deleteMessage);

module.exports = router;
