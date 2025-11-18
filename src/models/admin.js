const mongoose = require("mongoose");
const crypto = require("crypto");

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" },

    // Add these for password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

// Method to generate token
adminSchema.methods.generatePasswordReset = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

  return resetToken;
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
