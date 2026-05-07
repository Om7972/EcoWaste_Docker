const User = require('../models/User');

exports.getPoints = async (req, res) => {
  res.json({ success: true, data: { points: req.user.rewardPoints } });
};

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ rewardPoints: -1 }).limit(20).select('name email rewardPoints avatar');
    res.json({ success: true, data: users });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.redeem = async (req, res) => {
  try {
    const { points } = req.body;
    if (req.user.rewardPoints < points) return res.status(400).json({ success: false, message: 'Insufficient points' });
    const user = await User.findByIdAndUpdate(req.user._id, { $inc: { rewardPoints: -points } }, { new: true });
    res.json({ success: true, data: user, message: 'Points redeemed successfully' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
