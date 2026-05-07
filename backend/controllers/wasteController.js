const WasteReport = require('../models/WasteReport');
const User = require('../models/User');

const WASTE_CATEGORIES = {
  plastic: { recyclable: true, tips: ['Rinse containers', 'Check recycling symbol', 'Remove caps'] },
  paper: { recyclable: true, tips: ['Keep dry and clean', 'Flatten cardboard', 'Remove staples'] },
  glass: { recyclable: true, tips: ['Rinse containers', 'Remove lids', 'Separate by color'] },
  organic: { recyclable: false, tips: ['Compost food waste', 'Use for garden mulch', 'Avoid meat in compost'] },
  metal: { recyclable: true, tips: ['Rinse cans', 'Crush to save space', 'Remove labels'] },
  ewaste: { recyclable: false, tips: ['Take to e-waste center', 'Remove batteries', 'Never put in regular trash'] },
  textile: { recyclable: true, tips: ['Donate wearable items', 'Repurpose as rags', 'Take to textile recycling'] },
};

exports.predict = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    // Simulated AI prediction
    const categories = Object.keys(WASTE_CATEGORIES);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const confidence = 75 + Math.random() * 20;
    const catData = WASTE_CATEGORIES[category];

    const report = await WasteReport.create({
      user: req.user._id,
      image: `/uploads/${req.file.filename}`,
      prediction: { category, confidence: Math.round(confidence * 10) / 10, recyclable: catData.recyclable, tips: catData.tips },
      pointsEarned: 10,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { rewardPoints: 10 } });
    res.status(201).json({ success: true, data: report });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getHistory = async (req, res) => {
  try {
    const reports = await WasteReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await WasteReport.aggregate([
      { $group: { _id: '$prediction.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: stats });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
