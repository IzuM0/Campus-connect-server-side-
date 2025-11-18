require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Load DB
const connectDB = require("./src/config/db");

// Import routes
const messageRoutes = require("./src/routes/messages.routes");
const adminRoutes = require("./src/routes/admin.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
// Parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Logging requests
app.use(morgan("dev"));

// Rate limiting (apply to all routes or just sensitive ones)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});
app.use(limiter);

// --- DATABASE CONNECTION ---
connectDB();

// --- ROUTES ---
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

// Basic test route
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
