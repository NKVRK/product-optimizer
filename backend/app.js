const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initDB } = require('./db');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.set('trust proxy', 1);

// --- Middleware Setup ---

// Helmet helps secure the app by setting various HTTP headers.
app.use(helmet());

// Rate limiting prevents abuse by limiting requests from the same IP.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Morgan is used for logging HTTP requests to the console.
app.use(morgan('combined'));

// CORS configuration to allow requests from the frontend.
app.use(cors({
  origin: true,
  credentials: true,
}));

// Body parsing middleware to handle JSON and URL-encoded data.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Routing ---

// All product-related routes are handled by productRoutes.
app.use('/api', productRoutes);

// A simple health check endpoint to confirm the server is running.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- Error Handling ---

// A centralized error handler for any uncaught exceptions.
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    // Only show detailed error messages in development mode for security.
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

// A 404 handler for any requests to non-existent routes.
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Server Startup ---

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize the database schema before starting the server.
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
