const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});