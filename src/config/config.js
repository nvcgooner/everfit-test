require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/everfit-test',
  nodeEnv: process.env.NODE_ENV || 'development',
  maxDataPoints: parseInt(process.env.MAX_DATA_POINTS) || 100,
};

