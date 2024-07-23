//backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const videoRoutes = require("./routes/videoRoutes");

// Disable ytdl-core update check
process.env.YTDL_NO_UPDATE = "1";

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "https://yezdl.com",
      "https://www.yezdl.com",
    ];
    if (
      !origin ||
      allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))
    ) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", videoRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err);
  res.status(500).json({
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === "production" ? {} : err.toString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Create HTTP server
const server = http.createServer(app);

// Configure server timeout
server.timeout = 300000; // 5 minutes

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});

module.exports = server;
