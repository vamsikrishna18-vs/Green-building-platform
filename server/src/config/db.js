const mongoose = require('mongoose');

// Disable query buffering when disconnected to prevent timeouts
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('[MongoDB] ERROR: MONGODB_URI is missing');
    return false;
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });

    console.log('[MongoDB Atlas] Connected successfully');
    return true;

  } catch (error) {
    console.error('[MongoDB Atlas] Connection failed');
    console.error('[MongoDB Atlas] Reason:', error.message);
    return false;
  }
};

module.exports = connectDB;