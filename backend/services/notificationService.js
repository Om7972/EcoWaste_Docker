const Notification = require('../models/Notification');
const User = require('../models/User');
const Alert = require('../models/Alert');

let io = null;

const setSocketIO = (socketIO) => {
  io = socketIO;
};

/**
 * Send in-app notification to specific user
 */
const sendNotification = async (userId, title, message, type = 'info') => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
    });

    if (io) {
      io.to(`user:${userId}`).emit('notification:new', notification);
    }

    return notification;
  } catch (error) {
    console.error('Notification Error:', error.message);
  }
};

/**
 * Send notification to all users with a specific role
 */
const sendRoleNotification = async (role, title, message, type = 'warning') => {
  try {
    const users = await User.find({ role });
    const notifications = await Promise.all(
      users.map(user => sendNotification(user._id, title, message, type))
    );
    return notifications.filter(Boolean);
  } catch (error) {
    console.error('Role Notification Error:', error.message);
  }
};

/**
 * Process overflow alerts and send notifications to relevant stakeholders
 */
const processOverflowAlert = async (alert) => {
  try {
    // Notify admins
    await sendRoleNotification('admin',
      '🚨 Bin Overflow Alert',
      alert.message,
      'error'
    );

    // Notify collectors
    await sendRoleNotification('collector',
      '📦 Collection Needed',
      `${alert.message}. Please check your route.`,
      'warning'
    );

    // Update alert with notification records
    await Alert.findByIdAndUpdate(alert._id, {
      $push: {
        notificationsSent: {
          channel: 'in_app',
          sentAt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('Process Alert Error:', error.message);
  }
};

/**
 * Send daily summary to admins
 */
const sendDailySummary = async (stats) => {
  const title = '📊 Daily Waste Collection Summary';
  const message = `Today's Stats: ${stats.collectionsCompleted} collections, ` +
    `${stats.totalWasteCollected}kg waste collected, ` +
    `${stats.overflowIncidents} overflow incidents, ` +
    `${stats.efficiency}% route efficiency.`;

  await sendRoleNotification('admin', title, message, 'info');
};

module.exports = {
  setSocketIO,
  sendNotification,
  sendRoleNotification,
  processOverflowAlert,
  sendDailySummary,
};
