// src/controllers/admin.controller.js
// src/controllers/admin.controller.js
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // <-- add this

// Admin login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Create JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, admin: { id: admin._id, email: admin.email, role: admin.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create new admin
const createAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ email, passwordHash: hashedPassword, role });
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }
    const updated = await Admin.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { login, getAdmins, createAdmin, updateAdmin, deleteAdmin };