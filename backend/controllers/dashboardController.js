const Complaint = require('../models/Complaint');
const WasteReport = require('../models/WasteReport');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [totalComplaints, resolvedComplaints, pendingComplaints, totalWaste] = await Promise.all([
      Complaint.countDocuments({ user: userId }),
      Complaint.countDocuments({ user: userId, status: 'resolved' }),
      Complaint.countDocuments({ user: userId, status: 'pending' }),
      WasteReport.countDocuments({ user: userId }),
    ]);
    res.json({ success: true, data: { totalComplaints, resolvedComplaints, pendingComplaints, totalWasteReported: totalWaste, rewardPoints: req.user.rewardPoints } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAdminStats = async (req, res) => {
  try {
    const [totalComplaints, resolved, pending, inProgress, totalUsers, wasteByCategory] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'resolved' }),
      Complaint.countDocuments({ status: 'pending' }),
      Complaint.countDocuments({ status: 'in_progress' }),
      User.countDocuments(),
      WasteReport.aggregate([{ $group: { _id: '$prediction.category', count: { $sum: 1 } } }]),
    ]);
    const topRecyclers = await User.find().sort({ rewardPoints: -1 }).limit(5).select('name email rewardPoints');
    res.json({ success: true, data: { totalComplaints, resolved, pending, inProgress, totalUsers, wasteByCategory, topRecyclers, recyclingRate: resolved > 0 ? Math.round((resolved / totalComplaints) * 100) : 0 } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAnalytics = async (req, res) => {
  try {
    const monthlyTrends = await Complaint.aggregate([
      { $group: { _id: { $month: '$createdAt' }, complaints: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, data: { monthlyTrends } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
