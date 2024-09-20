require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
app.use(compression());

const app = express();

connectDB(); // Connect to MongoDB



app.use(morgan('dev')); // Log requests
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(cors());         // Enables Cross-Origin Resource Sharing
app.use(helmet());       // Adds various security headers

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT signal received.');
  mongoose.connection.close(() => {
    console.log('MongoDB disconnected through app termination.');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
