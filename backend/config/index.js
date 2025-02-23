require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  twitterBearerToken: process.env.TWITTER_BEARER_TOKEN,
};