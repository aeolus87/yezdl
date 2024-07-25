// server.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xRoutes = require('./routes/xRoutes');
const logger = require('./utils/logger');
const config = require('./config');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

// Routes
app.use('/api/x', xRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Catch-all route for debugging
app.use((req, res) => {
  logger.info(`Received request for: ${req.method} ${req.url}`);
  res.status(404).send('Route not found');
});

// Start the server
app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

module.exports = app;