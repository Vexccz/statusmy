import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

// Load env vars (must be before db import so DATABASE_PATH is available)
dotenv.config();

import './config/db.js'; // Initialize SQLite (creates tables on import)
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import monitorRoutes from './routes/monitors.js';
import incidentRoutes from './routes/incidents.js';
import dashboardRoutes from './routes/dashboard.js';
import statusRoutes from './routes/status.js';
import alertRoutes from './routes/alerts.js';
import heartbeatRoutes from './routes/heartbeat.js';
import reportRoutes from './routes/reports.js';
import billingRoutes from './routes/billing.js';
import errorHandler from './middleware/errorHandler.js';
import { startScheduler, stopScheduler } from './services/scheduler.js';
import { setIO } from './socket.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- HTTP Server + Socket.io ---------------

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Socket.io auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
    } catch {
      // Allow unauthenticated connections for public status page
    }
  }
  next();
});

io.on('connection', (socket) => {
  if (socket.userId) {
    socket.join(`user:${socket.userId}`);
  }
  socket.join('public'); // Everyone joins public room for status page

  socket.on('disconnect', () => {});
});

// Store io in shared module to avoid circular imports
setIO(io);

export { io };

// --------------- Middleware ---------------

// Security headers
app.use(helmet());

// CORS - allow mobile app and frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);
      const allowed = [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:5173',
        'http://localhost:5000',
        'capacitor://localhost',
        'http://localhost',
      ];
      if (allowed.includes(origin) || origin.includes('statusmy')) {
        return callback(null, true);
      }
      callback(null, true); // Allow all for now
    },
    credentials: true,
  })
);

// Raw body parser for Stripe webhook (MUST be before json parser)
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);

// --------------- Routes ---------------

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sentry Clone API is running',
    timestamp: new Date().toISOString(),
  });
});

// Public status routes (NO auth required)
app.use('/api/status', statusRoutes);

// Public heartbeat endpoint (NO auth required - pinged by cron jobs)
app.use('/api/heartbeat', heartbeatRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// User routes
app.use('/api/user', userRoutes);

// Monitor routes
app.use('/api/monitors', monitorRoutes);

// Incident routes
app.use('/api/incidents', incidentRoutes);

// Dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// Alert routes
app.use('/api/alerts', alertRoutes);

// Report routes
app.use('/api/reports', reportRoutes);

// Billing routes
app.use('/api/billing', billingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// --------------- Start Server ---------------

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
  console.log(`👤 User routes: http://localhost:${PORT}/api/user`);
  console.log(`📡 Monitor routes: http://localhost:${PORT}/api/monitors`);
  console.log(`🚨 Incident routes: http://localhost:${PORT}/api/incidents`);
  console.log(`📊 Dashboard routes: http://localhost:${PORT}/api/dashboard`);
  console.log(`🌐 Status routes: http://localhost:${PORT}/api/status`);
  console.log(`🔔 Alert routes: http://localhost:${PORT}/api/alerts`);
  console.log(`📊 Report routes: http://localhost:${PORT}/api/reports`);
  console.log(`💳 Billing routes: http://localhost:${PORT}/api/billing`);
  console.log(`🔌 Socket.io: ws://localhost:${PORT}`);
  console.log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}\n`);

  // Start the monitor scheduler after server is ready
  startScheduler(io);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  stopScheduler();
  httpServer.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
