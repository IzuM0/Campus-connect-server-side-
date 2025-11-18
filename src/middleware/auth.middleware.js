const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const JWT_SECRET = process.env.JWT_SECRET || "insecure-dev";

exports.authAdmin = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    // optionally fetch admin to ensure still valid
    const admin = await Admin.findById(payload.sub).select("-passwordHash");
    if (!admin) return res.status(401).json({ message: "Unauthorized" });
    req.admin = admin;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
