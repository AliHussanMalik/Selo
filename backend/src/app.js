const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('express-async-errors');

const config = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const salonRoutes = require('./routes/salon.routes');
const bookingRoutes = require('./routes/booking.routes');
const resaleRoutes = require('./routes/resale.routes');

const app = express();

// Global Middlewares
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (
        config.cors.allowedOrigins.includes('*') ||
        config.cors.allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local dev
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Selo API', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/resale', resaleRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(config.env === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
