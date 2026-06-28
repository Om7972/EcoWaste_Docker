const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const { connectDB } = require('./config/db');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Security & parsing middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/waste', require('./routes/wasteRoutes'));
app.use('/api/recycling-centers', require('./routes/recyclingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/smart-bins', require('./routes/smartBinRoutes'));
app.use('/api/sustainability', require('./routes/sustainabilityRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'EcoWaste API is running', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Join user-specific room for targeted notifications
  socket.on('join:user', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Join role-based rooms
  socket.on('join:role', (role) => {
    socket.join(`role:${role}`);
  });

  // Request live bin data
  socket.on('bins:subscribe', () => {
    socket.join('bins:live');
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Initialize IoT services
  const { seedSmartBins, simulateSensorData, setSocketIO: setIoTSocket } = require('./services/iotSimulator');
  const { setSocketIO: setNotifSocket } = require('./services/notificationService');

  // Pass Socket.IO instance to services
  setIoTSocket(io);
  setNotifSocket(io);

  // Seed initial smart bins
  await seedSmartBins();

  // Schedule IoT sensor simulation every 10 seconds
  setInterval(async () => {
    await simulateSensorData();
  }, 10000);

  // Run prediction engine every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    const { predictAllOverflows } = require('./services/predictionEngine');
    console.log('🔮 Running overflow predictions...');
    await predictAllOverflows();
  });

  // Daily cleanup of old resolved alerts at midnight
  cron.schedule('0 0 * * *', async () => {
    const Alert = require('./models/Alert');
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await Alert.deleteMany({ resolved: true, resolvedAt: { $lte: weekAgo } });
    console.log('🧹 Cleaned up old resolved alerts');
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 WebSocket server ready`);
    console.log(`🌐 IoT sensor simulation active (10s intervals)`);
  });
};

startServer();

module.exports = app;
