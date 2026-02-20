const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes  = require('./routes/auth');
const dreamRoutes = require('./routes/dreams');

const app = express();
app.set('trust proxy', 1);

// ─── MIDDLEWARE DE SECURITATE ─────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:    ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.anthropic.com"],
      imgSrc:     ["'self'", "data:"],
    }
  }
}));

// ─── CORS ─────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Permite cereri fara origine (app-uri mobile, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ─── PARSARE BODY ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── LIMITARE RATA ───────────────────────────────────────────────────────
// Limitator general pentru toate rutele API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment before trying again.' }
});

// Limitator mai strict pentru endpoint-urile de autentificare
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please wait before trying again.' }
});

// Limitator pentru interpretarea viselor (apeleaza API-ul Anthropic — protejeaza-l)
const interpretLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Hourly interpretation limit reached. The oracle must rest.' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/dreams/interpret', interpretLimiter);

// ─── BAZA DE DATE ─────────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✦ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('✦ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// ─── RUTE ─────────────────────────────────────────────────────────────────
app.use('/api/auth',   authRoutes);
app.use('/api/dreams', dreamRoutes);

// Endpoint de verificare stare
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Nous Dream Interpreter',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ─── SERVE FRONTEND (productie) ──────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client')));
  // Orice ruta non-API serveste frontend-ul
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'client', 'index.html'));
    }
  });
}

// ─── HANDLER 404 ─────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── HANDLER GLOBAL ERORI ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  // Eroare CORS
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation.' });
  }

  console.error(`[${new Date().toISOString()}] Error:`, err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An internal server error occurred.'
    : err.message;

  res.status(statusCode).json({ error: message });
});

// ─── OPRIRE GRADUALA ─────────────────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\n✦ Received ${signal}. Closing server gracefully…`);
  await mongoose.connection.close();
  console.log('✦ MongoDB connection closed.');
  process.exit(0);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ─── START ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✦ Nous server running on port ${PORT}`);
    console.log(`✦ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✦ Health check: http://localhost:${PORT}/api/health\n`);
  });
});
