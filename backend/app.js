const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xRoutes = require('./routes/xRoutes');
const logger = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/x', xRoutes);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;