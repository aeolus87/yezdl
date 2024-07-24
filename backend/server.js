//backend\server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
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

// Get frontend URL from environment variable
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Update CORS configuration
const corsOptions = {
  origin: [FRONTEND_URL],
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));

const io = socketIo(server, {
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