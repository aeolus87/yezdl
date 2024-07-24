//backend\server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const videoRoutes = require("./routes/videoRoutes");
const errorHandler = require("./middlewares/errorHandler");
const cleanupOldFiles = require("./cleanup/cleanupOldFiles");

const app = express();
app.use(cors({
  origin: "https://yezdl.com",
  exposedHeaders: ["Content-Disposition"],
}));
app.use(express.json());

app.use("/api", videoRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

global.io = io;

// Run cleanup every hour
setInterval(cleanupOldFiles, 3600000);
