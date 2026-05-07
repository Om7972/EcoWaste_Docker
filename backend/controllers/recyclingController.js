const RecyclingCenter = require('../models/RecyclingCenter');

exports.getAll = async (req, res) => {
  try {
    const centers = await RecyclingCenter.find().sort({ rating: -1 });
    res.json({ success: true, data: centers });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const center = await RecyclingCenter.findById(req.params.id);
    if (!center) return res.status(404).json({ success: false, message: 'Center not found' });
    res.json({ success: true, data: center });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getNearby = async (req, res) => {
  try {
    const { lat, lng, radius = 10000 } = req.query;
    const centers = await RecyclingCenter.find({
      location: { $near: { $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] }, $maxDistance: Number(radius) } },
    });
    res.json({ success: true, data: centers });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
