const setupSwagger = require('./swagger');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDatabase = require('./config/database');
const config = require('./config/config');
const errorHandler = require('./middlewares/errorHandler');

const metricsRoutes = require('./modules/metrics/metrics.routes');

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/metrics', metricsRoutes);
setupSwagger(app);

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${config.nodeEnv} mode`);
});

module.exports = app;

