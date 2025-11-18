const express = require("express");
const router = express.Router();

// Import admin controller functions
const { login, getAdmins, createAdmin, updateAdmin, deleteAdmin } = require("../controllers/admin.controller");


// admin login 
router.post("/login", login);
// Get all admins
router.get("/", getAdmins);

// Create a new admin
router.post("/", createAdmin);

// Update an admin
router.put("/:id", updateAdmin);

// Delete an admin
router.delete("/:id", deleteAdmin);

module.exports = router;