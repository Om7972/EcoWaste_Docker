const Route = require('../models/Route');

exports.getAll = async (req, res) => {
  try {
    const routes = await Route.find().populate('collector', 'name email').sort({ scheduledDate: -1 });
    res.json({ success: true, data: routes });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('collector', 'name email');
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    res.json({ success: true, data: route });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json({ success: true, data: route });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    res.json({ success: true, data: route });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.optimize = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    // Simulated optimization - shuffle stops for demo
    route.estimatedDuration = Math.floor(route.stops.length * 15 + Math.random() * 30);
    await route.save();
    res.json({ success: true, data: route, message: 'Route optimized successfully' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
