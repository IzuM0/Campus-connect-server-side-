const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { sub: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({ token, expiresIn: JWT_EXPIRES_IN });

  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };
