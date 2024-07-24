//backend\server.js
require('dotenv').config(); // Add this at the top

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const cloudinary = require('cloudinary').v2;
const videoRoutes = require('./routes/videoRoutes');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const server = http.createServer(app);

// Get frontend URL from environment variable and sanitize it
const FRONTEND_URL = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : 'http://localhost:3000';

console.log('FRONTEND_URL:', FRONTEND_URL); // Add this for debugging

// Validate the URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

if (!isValidUrl(FRONTEND_URL)) {
  console.error(`Invalid FRONTEND_URL: ${FRONTEND_URL}`);
  process.exit(1);
}

// Update CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (FRONTEND_URL === origin || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

app.use(express.json());

// Middleware to attach io to req object
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', videoRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server };