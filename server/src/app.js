const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load .env FIRST (resolving server/.env regardless of process.cwd())
const serverEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

const cookieParser = require('cookie-parser');

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

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*') return callback(null, true);
    const allowed = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
    if (allowed.includes(origin)) return callback(null, true);
    callback(null, true);
  },
  credentials: true
}));

app.use(cookieParser());

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

    if (!process.env.MONGODB_URI) {
      console.warn('[Config] Notice: MONGODB_URI is missing from .env. Server will run in in-memory fallback mode.');
    } else {
      console.log('[Config] MONGODB_URI loaded');
    }

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
