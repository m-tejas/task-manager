const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MongoDB_URI; // MongoDB URI from .env file
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined');
    }
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
