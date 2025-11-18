const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "insecure-dev";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ sub: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ token, expiresIn: JWT_EXPIRES_IN });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const resetToken = admin.generatePasswordReset(); // assume method in Admin model
    await admin.save();

    const resetURL = `${process.env.FRONTEND_ORIGIN || "http://localhost:3000"}/reset-password/${resetToken}`;
    console.log(`Password reset link for ${email}:`, resetURL);

    return res.json({ message: "Password reset link generated", resetToken, resetURL });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: "Token and newPassword required" });

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!admin) return res.status(400).json({ message: "Invalid or expired token" });

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
// DELETE MESSAGE
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const msg = await Message.findByIdAndDelete(id);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login, forgotPassword, resetPassword, deleteMessage };
