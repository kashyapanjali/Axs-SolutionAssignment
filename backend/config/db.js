const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
      await mongoose.connect(mongoURI);
      console.log('MongoDB Connected successfully!');
    } catch (error) {
      console.error(`MongoDB connection error: ${error.message}`);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;