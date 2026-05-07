const Notification = require('../models/Notification');

exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: notifications });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.markRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json({ success: true, data: notification });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
