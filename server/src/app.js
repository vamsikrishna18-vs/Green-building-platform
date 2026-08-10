const dotenv = require('dotenv');

// Load .env FIRST
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const assessmentRoutes = require('./routes/assessmentRoutes');
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// MIDDLEWARE & CORS
// =====================================================

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : '*';

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({
  limit: '10mb'
}));

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'GreenBuild Sustainability Platform API',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// API ROUTES
// =====================================================

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/assessments', assessmentRoutes);

// =====================================================
// PRODUCTION STATIC FRONTEND SERVING (SINGLE SERVICE URL)
// =====================================================

const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log('[Production] Serving compiled React client from client/dist');
  app.use(express.static(clientDistPath));
  
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(errorHandler);

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
  try {
    console.log('');
    console.log('========================================');
    console.log('   GREENBUILD BACKEND STARTING');
    console.log('========================================');

    // Check environment variable
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from .env');
    }

    console.log('[Config] MONGODB_URI loaded');

    // Connect to MongoDB Atlas FIRST
    console.log('[MongoDB] Connecting to MongoDB Atlas...');

    const dbConnected = await connectDB();

    if (!dbConnected) {
      console.warn('[MongoDB] Warning: Database connection offline or timing out. Operating with in-memory persistence fallback mode.');
    } else {
      console.log('[MongoDB] MongoDB Atlas connected successfully');
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log('   GREENBUILD SERVER READY FOR PRODUCTION');
      console.log('========================================');
      console.log(`Port: ${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log(`Assessments: http://localhost:${PORT}/api/assessments`);
      console.log('Database: MongoDB Atlas');
      console.log('========================================');
      console.log('');
    });

  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('   SERVER STARTUP FAILED');
    console.error('========================================');
    console.error(error.message);
    console.error('========================================');
    process.exit(1);
  }
};

startServer();
