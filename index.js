require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");

// Load DB
const connectDB = require("./src/config/db");
const Admin = require("./src/models/admin");

// Import routes
const messageRoutes = require("./src/routes/messages.routes");
const adminRoutes = require("./src/routes/admin.routes");
const feedbackRoutes = require("./src/routes/feedback.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes"); // Dashboard routes

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// --- DATABASE CONNECTION ---
connectDB().then(async () => {
  // Seed default admin
  try {
    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        passwordHash: hashedPassword,
        role: "admin",
      });
      console.log("Default admin created in DB");
    } else {
      console.log("Admin already exists in DB");
    }
  } catch (err) {
    console.error("Error seeding admin:", err);
  }
});

// --- ROUTES ---
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/dashboard", dashboardRoutes); // Mount dashboard routes

// --- TEST ROUTE ---
app.get("/", (req, res) => {
  res.send("Backend working");
});

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});